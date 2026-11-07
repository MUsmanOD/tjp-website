import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Membership, Audit, audit } from "../../infrastructure/models.js";
import { unseal, digest } from "../../infrastructure/crypto.js";
import { ApiError, rateLimit } from "../../middleware/security.js";
import { requireAdmin, requireStepUp } from "../auth.js";
import { query } from "./query.js";
import { stored, view } from "./service.js";
import { membershipSchema, digits } from "./schema.js";
async function createMembership(input: unknown, idempotency: string) {
  const data = membershipSchema.parse(input);
  const key = digest(idempotency);
  const payloadHash = digest(JSON.stringify(data));
  const missing: Record<string, string> = {};
  if (!data.gender) missing.gender = "REQUIRED";
  if (!data.religiousCommunity) missing.religiousCommunity = "REQUIRED";
  if (Object.keys(missing).length) throw new ApiError(422, "VALIDATION", missing);
  const previous = await Membership.findOne({ idempotency: key });
  if (previous) {
    if (previous.payloadHash !== payloadHash)
      throw new ApiError(409, "IDEMPOTENCY");
    return { row: previous, created: false };
  }
  const row = new Membership({
    reference: "TJP-" + randomUUID(),
    idempotency: key,
    payloadHash,
    consentVersion: "2026-10-28",
    consentedAt: new Date(),
  });
  Object.assign(row, stored(data, String(row._id)));
  try {
    await row.save();
  } catch (error: any) {
    if (error.code !== 11000) throw error;
    const existing = await Membership.findOne({ idempotency: key });
    if (!existing || existing.payloadHash !== payloadHash)
      throw new ApiError(409, "IDEMPOTENCY");
    return { row: existing, created: false };
  }
  return { row, created: true };
}

export const publicMemberships = Router();
publicMemberships.post("/", async (req, res) => {
  const idempotency = z.uuid().parse(req.get("idempotency-key"));
  const { row } = await createMembership(req.body, idempotency);
  res.status(202).json({ reference: row.reference });
});
export const adminMemberships = Router();
adminMemberships.use(requireAdmin);
adminMemberships.post("/", rateLimit("admin-member-create", 30, 3600000), async (req, res) => {
  const idempotency = z.uuid().parse(req.get("idempotency-key"));
  const actor = String(res.locals.session.adminId);
  const { row, created } = await createMembership(req.body, "admin:" + actor + ":" + idempotency);
  if (created) await audit(actor, "membership-create", String(row._id));
  res.status(created ? 201 : 200).json({ id: String(row._id), reference: row.reference });
});
adminMemberships.get("/", async (req, res) => {
  const { where, page } = query(req.query);
  const [rows, total] = await Promise.all([
    Membership.find(where)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * 25)
      .limit(25),
    Membership.countDocuments(where),
  ]);
  res.json({
    rows: rows.map((row) => view(row)),
    total,
    page,
    pages: Math.ceil(total / 25),
  });
});
adminMemberships.get("/tree", async (req, res) => {
  const { where, group = "country" } = query(req.query);
  res.json(
    await Membership.aggregate([
      { $match: where },
      {
        $group: {
          _id: {
            $cond: [
              { $in: ["$" + group, [null, ""]] },
              "__none__",
              "$" + group,
            ],
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 1000 },
    ]),
  );
});
adminMemberships.post("/search", async (req, res) => {
  const { field, value } = z
    .object({
      field: z.enum(["name", "email", "phone", "identity", "reference"]),
      value: z.string().trim().min(1).max(150),
    })
    .strict()
    .parse(req.body);
  const where =
    field === "reference"
      ? { reference: value }
      : {
          [field + "Hash"]: digest(
            ["name", "email"].includes(field)
              ? value.toLowerCase()
              : field === "phone"
                ? parsePhoneNumberFromString(digits(value), "PK")?.number ||
                  value
                : digits(value).replaceAll("-", ""),
          ),
        };
  res.json({
    rows: (await Membership.find(where).limit(25)).map((row) => view(row)),
  });
});
adminMemberships.param("id", (req, _res, next, id) => {
  if (!/^[a-f0-9]{24}$/.test(id)) return next(new ApiError(404, "NOT_FOUND"));
  next();
});
adminMemberships.get("/:id", async (req, res) => {
  const row = await Membership.findById(req.params.id);
  if (!row) throw new ApiError(404, "NOT_FOUND");
  const conditions = ["emailHash", "phoneHash", "identityHash"]
    .filter((key) => row.get(key))
    .map((key) => ({ [key]: row.get(key) }));
  const duplicates = conditions.length
    ? await Membership.find({ _id: { $ne: row._id }, $or: conditions })
        .select("reference status")
        .limit(10)
    : [];
  await audit(String(res.locals.session.adminId), "view", String(row._id));
  res.json({
    ...view(row),
    duplicates,
    history: await Audit.find({ target: String(row._id) })
      .sort({ createdAt: -1 })
      .limit(100)
      .select("action fields createdAt"),
  });
});
adminMemberships.post("/:id/reveal", requireStepUp, async (req, res) => {
  const row = await Membership.findById(req.params.id);
  if (!row) throw new ApiError(404, "NOT_FOUND");
  await audit(String(res.locals.session.adminId), "reveal-id", String(row._id));
  res.json({ identity: view(row, true).identity });
});
adminMemberships.patch("/:id", async (req, res) => {
  const row = await Membership.findById(req.params.id);
  if (!row) throw new ApiError(404, "NOT_FOUND");
  const old = unseal(String(row.privateData), String(row._id));
  const data = membershipSchema.parse({
    ...req.body,
    identity:
      req.body.identity === undefined ? old.identity : req.body.identity,
    religiousCommunity:
      req.body.religiousCommunity ?? old.religiousCommunity ?? "",
    education: req.body.education ?? old.education ?? "",
    profession: req.body.profession ?? old.profession ?? "",
  });
  if (
    data.identity !== old.identity ||
    data.identityType !== old.identityType
  ) {
    requireStepUp(req, res, () => {});
  }
  if (req.get("if-match") !== (row.updatedAt as Date).toISOString())
    throw new ApiError(409, "STATUS");
  const fields = Object.keys(data).filter(
    (k) => JSON.stringify(old[k]) !== JSON.stringify((data as any)[k]),
  );
  await row.db.transaction(async (session) => {
    const changed = await Membership.updateOne(
      { _id: row._id, updatedAt: row.updatedAt },
      { $set: stored(data, String(row._id)) },
      { session },
    );
    if (!changed.modifiedCount) throw new ApiError(409, "STATUS");
    await Audit.create(
      [
        {
          actor: String(res.locals.session.adminId),
          action: "correct",
          target: String(row._id),
          fields,
        },
      ],
      { session },
    );
  });
  res.json({ ok: true });
});
adminMemberships.post("/:id/status", async (req, res) => {
  const { status } = z
    .object({
      status: z.enum([
        "pending",
        "approved",
        "rejected",
        "archived",
        "restore",
      ]),
    })
    .strict()
    .parse(req.body);
  const row = await Membership.findById(req.params.id);
  if (!row) throw new ApiError(404, "NOT_FOUND");
  const next = status === "restore" ? row.previousStatus : status;
  if (
    (status === "restore" && row.status !== "archived") ||
    (row.status === "archived" && status !== "restore")
  )
    throw new ApiError(409, "STATUS");
  const updates: any = { status: next };
  if (status === "archived") updates.previousStatus = row.status;
  if (next === "approved" && !row.membershipNumber)
    updates.membershipNumber = "TJP-M-" + randomUUID();
  await row.db.transaction(async (session) => {
    const result = await Membership.updateOne(
      { _id: row._id, status: row.status },
      { $set: updates },
      { session },
    );
    if (!result.modifiedCount) throw new ApiError(409, "STATUS");
    await Audit.create(
      [
        {
          actor: String(res.locals.session.adminId),
          action: "status-" + next,
          target: String(row._id),
        },
      ],
      { session },
    );
  });
  res.json({ ok: true });
});
adminMemberships.delete("/:id", requireStepUp, async (req, res) => {
  await Membership.db.transaction(async (session) => {
    await Membership.deleteOne({ _id: req.params.id }, { session });
    await Audit.deleteMany({ target: req.params.id }, { session });
    await Audit.create(
      [
        {
          actor: String(res.locals.session.adminId),
          action: "removed",
          target: String(req.params.id),
        },
      ],
      { session },
    );
  });
  res.json({ ok: true });
});

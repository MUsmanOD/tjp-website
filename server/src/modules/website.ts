import express from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import defaults from "../data/website-defaults.json" with { type: "json" };
import { digest, seal, unseal } from "../infrastructure/crypto.js";
import { audit } from "../infrastructure/models.js";
import { ContactMessage, WebsiteEntry } from "../infrastructure/website-models.js";
import { downloadWebsiteImage, uploadWebsiteImage } from "../infrastructure/website-images.js";
import { ApiError, rateLimit } from "../middleware/security.js";
import { requireAdmin } from "./auth.js";
import {
  contactSchema, faviconSchema, gallerySchema, leaderSchema, menuSchema, messageSchema, pageText, settingsSchema, websiteImage,
} from "./website-schema.js";

const collections = ["leaders", "gallery", "menu"] as const;
const kindSchema = z.enum(collections);
type Kind = z.infer<typeof kindSchema>;
const pageKeys = Object.keys(defaults.pages) as (keyof typeof defaults.pages)[];
const recordId = /^[a-zA-Z0-9-]{1,64}$/;
const mediaId = /^(settings|favicon|(?:leaders|gallery):[a-zA-Z0-9-]{1,64})$/;

const imageUrl = (id: string, version: string, privateImage = false) =>
  `/api/v1/${privateImage ? "admin/" : ""}website/media/${encodeURIComponent(id)}/${version}`;

async function content(admin: boolean) {
  const stored = await WebsiteEntry.find().select("kind data imageVersion").lean();
  const entries = new Map(stored.map((row) => [row._id, row]));
  const settings = entries.get("settings");
  const favicon = entries.get("favicon");
  function collection<K extends Kind>(kind: K): (typeof defaults)[K] {
    const records = new Map(defaults[kind].map((item) => [item.id, item]));
    for (const row of stored) {
      if (row.kind !== kind) continue;
      const id = row._id.slice(kind.length + 1);
      records.set(id, {
        ...records.get(id), ...row.data, id,
        ...(row.imageVersion ? { imageUrl: imageUrl(row._id, row.imageVersion, !row.data.published) } : {}),
      });
    }
    return [...records.values()]
      .filter((item) => admin || item.published)
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)) as (typeof defaults)[K];
  }
  return {
    settings: {
      ...defaults.settings,
      ...settings?.data,
      logo: settings?.imageVersion ? imageUrl("settings", settings.imageVersion) : defaults.settings.logo,
      favicon: favicon?.imageVersion ? imageUrl("favicon", favicon.imageVersion) : "/favicon.ico",
    },
    contact: { ...defaults.contact, ...entries.get("contact")?.data },
    leaders: collection("leaders"),
    gallery: collection("gallery"),
    menu: collection("menu"),
    pages: Object.fromEntries(pageKeys.map((page) => {
      const fields = entries.get("pages:" + page)?.data.fields as { path: string; value: z.infer<typeof pageText> }[] | undefined;
      const values = new Map(fields?.map(({ path, value }) => [path, value]));
      return [page, defaults.pages[page].map((field) => ({
        ...field, value: values.get(field.path) ?? field.value,
      }))];
    })),
  };
}

type RecordKind = Kind | "settings" | "contact" | "pages" | "favicon";

async function saveEntry(id: string, kind: RecordKind, data: object,
  bytes?: Buffer, resetImage = false) {
  const version = bytes ? randomUUID() : undefined;
  if (version && bytes) await uploadWebsiteImage(version, bytes);
  await WebsiteEntry.updateOne({ _id: id }, {
    $set: { kind, data, ...(version ? { imageStorage: "cloudinary", imageVersion: version } : {}) },
    ...(resetImage ? { $unset: { image: 1, imageStorage: 1, imageVersion: 1 } }
      : version ? { $unset: { image: 1 } } : {}),
  }, { upsert: true });
}

async function importWebsite() {
  const rows: { id: string; kind: RecordKind; data: object }[] = [
    { id: "settings", kind: "settings", data: defaults.settings },
    { id: "contact", kind: "contact", data: defaults.contact },
    { id: "favicon", kind: "favicon", data: { source: "/favicon.ico" } },
  ];
  for (const kind of collections) {
    for (const { id, ...data } of defaults[kind]) rows.push({ id: kind + ":" + id, kind, data });
  }
  for (const page of pageKeys) {
    const data = { fields: defaults.pages[page].map(({ path, value }) => ({ path, value })) };
    rows.push({ id: "pages:" + page, kind: "pages", data });
  }
  const result = await WebsiteEntry.bulkWrite(rows.map(({ id, kind, data }) => ({
    updateOne: { filter: { _id: id }, update: { $setOnInsert: { kind, data } }, upsert: true },
  })), { ordered: false });
  return { imported: result.upsertedCount, total: rows.length };
}

function serveImage(privateImage: boolean): express.RequestHandler {
  return async (req, res) => {
    const id = z.string().regex(mediaId).parse(req.params.id);
    const version = z.uuid().parse(req.params.version);
    const record = await WebsiteEntry.findOne({
      _id: id,
      imageVersion: version,
      ...(!privateImage && id !== "settings" && id !== "favicon" ? { "data.published": true } : {}),
    }).select("+image");
    if (!record) throw new ApiError(404, "NOT_FOUND");
    const bytes = record.imageStorage === "cloudinary" ? await downloadWebsiteImage(version) : record.image;
    if (!bytes?.length) throw new ApiError(404, "NOT_FOUND");
    res.set("Content-Type", "image/webp");
    res.set("Content-Security-Policy", "default-src 'none'; sandbox");
    res.set("Content-Disposition", "inline");
    res.set("X-Robots-Tag", "noindex, noimageindex, noai, noimageai");
    res.send(bytes);
  };
}

export const publicWebsite = express.Router();
publicWebsite.get("/", async (_req, res) => res.json(await content(false)));
publicWebsite.get("/media/:id/:version", serveImage(false));
publicWebsite.post("/messages", rateLimit("contact-message", 6, 3600000), async (req, res) => {
  const { id, topic, ...privateData } = messageSchema.parse(req.body);
  const payloadHash = digest(JSON.stringify({ topic, ...privateData }));
  const row = await ContactMessage.findOneAndUpdate({ _id: id }, {
    $setOnInsert: {
      topic, payloadHash,
      privateData: seal(privateData, "contact:" + id),
      createdAt: new Date(),
    },
  }, { upsert: true, returnDocument: "after" }).select("+payloadHash");
  if (row?.payloadHash !== payloadHash) throw new ApiError(409, "IDEMPOTENCY");
  res.status(201).json({ ok: true });
});

export const adminWebsite = express.Router();
adminWebsite.use(requireAdmin);
const editorBody = express.json({ limit: "3mb", inflate: false });
const editLimit = rateLimit("website-editor", 30, 60000);

adminWebsite.get("/", async (_req, res) => res.json(await content(true)));
adminWebsite.get("/media/:id/:version", serveImage(true));
adminWebsite.post("/import", rateLimit("website-import", 5, 60_000), async (_req, res) => {
  const result = await importWebsite();
  await audit(String(res.locals.session.adminId), "website-import", "website");
  res.json(result);
});
adminWebsite.put("/pages/:page", editLimit, editorBody, async (req, res) => {
  const page = z.enum(pageKeys).parse(req.params.page);
  const fields = z.strictObject(Object.fromEntries(defaults.pages[page].map(({ path }) => [path, pageText])));
  const values = Object.entries(fields.parse(req.body)).map(([path, value]) => ({ path, value }));
  await saveEntry("pages:" + page, "pages", { fields: values });
  await audit(String(res.locals.session.adminId), "website-page", page);
  res.json({ ok: true });
});
adminWebsite.put("/favicon", editLimit, editorBody, async (req, res) => {
  const { image, reset } = faviconSchema.parse(req.body);
  if (Boolean(image) === Boolean(reset)) throw new ApiError(422, "INVALID_IMAGE");
  await saveEntry("favicon", "favicon", { source: "/favicon.ico" }, websiteImage(image), reset);
  await audit(String(res.locals.session.adminId), "website-settings", "favicon");
  res.json({ ok: true });
});
adminWebsite.put("/settings", editLimit, editorBody, async (req, res) => {
  const { image, resetLogo, ...data } = settingsSchema.parse(req.body);
  if (image && resetLogo) throw new ApiError(422, "INVALID_IMAGE");
  await saveEntry("settings", "settings", data, websiteImage(image), resetLogo);
  await audit(String(res.locals.session.adminId), "website-settings", "settings");
  res.json({ ok: true });
});
adminWebsite.put("/contact", editLimit, editorBody, async (req, res) => {
  await saveEntry("contact", "contact", contactSchema.parse(req.body));
  await audit(String(res.locals.session.adminId), "website-contact", "contact");
  res.json({ ok: true });
});

const inboxPage = z.coerce.number().int().min(1).max(100000).default(1);
adminWebsite.get("/messages", async (req, res) => {
  const requested = inboxPage.parse(req.query.page);
  const total = await ContactMessage.countDocuments();
  const pages = Math.max(1, Math.ceil(total / 20));
  const page = Math.min(requested, pages);
  const rows = await ContactMessage.find().select("topic createdAt readAt")
    .sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20).lean();
  res.json({ page, pages, total, rows });
});
adminWebsite.get("/messages/:id", async (req, res) => {
  const id = z.uuid().parse(req.params.id);
  const row = await ContactMessage.findById(id).lean();
  if (!row) throw new ApiError(404, "NOT_FOUND");
  const { privateData, ...summary } = row;
  const message = unseal<{ name: string; email: string; message: string }>(privateData, "contact:" + id);
  res.json({ ...summary, ...message });
});
adminWebsite.patch("/messages/:id/read", editLimit, async (req, res) => {
  const id = z.uuid().parse(req.params.id);
  await ContactMessage.updateOne({ _id: id, readAt: { $exists: false } }, { $set: { readAt: new Date() } });
  res.json({ ok: true });
});

adminWebsite.put("/:kind/:id", editLimit, editorBody, async (req, res) => {
  const kind = kindSchema.parse(req.params.kind);
  const id = z.string().regex(recordId).parse(req.params.id);
  const key = kind + ":" + id;
  const original = defaults[kind].some((item) => item.id === id);
  if (!original && !z.uuid().safeParse(id).success) throw new ApiError(404, "NOT_FOUND");
  if (kind === "menu") {
    await saveEntry(key, kind, menuSchema.parse(req.body));
    await audit(String(res.locals.session.adminId), "website-content", key);
    return res.json({ ok: true });
  }
  const { image, ...data } = (kind === "leaders" ? leaderSchema : gallerySchema).parse(req.body);
  if (!image && !original && !await WebsiteEntry.exists({ _id: key })) {
    throw new ApiError(422, "IMAGE_REQUIRED");
  }
  await saveEntry(key, kind, data, websiteImage(image));
  await audit(String(res.locals.session.adminId), "website-content", key);
  res.json({ ok: true });
});

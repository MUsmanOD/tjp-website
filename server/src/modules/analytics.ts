import { Router } from "express";
import { z } from "zod";
import { Analytics, Visit, Membership } from "../infrastructure/models.js";
import { digest, token } from "../infrastructure/crypto.js";
import { cookieOptions, cookieName } from "../middleware/security.js";
import { requireAdmin } from "./auth.js";
const day = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(
    new Date(),
  );
export const analyticsRouter = Router();
analyticsRouter.post("/events", async (req, res) => {
  if (req.cookies[cookieName("access")] || req.cookies[cookieName("refresh")]) {
    res.json({ ok: true });
    return;
  }
  const { path } = z
    .object({
      path: z.enum(["/", "/membership", "/gallery", "/blogs", "/contact"]),
    })
    .strict()
    .parse(req.body);
  const id = /^[a-f0-9]{64}$/.test(req.cookies[cookieName("visit")] || "")
    ? req.cookies[cookieName("visit")]
    : token();
  res.cookie(cookieName("visit"), id, { ...cookieOptions, maxAge: 1800000 });
  const key = digest(id + day() + path);
  let fresh = false;
  try {
    await Visit.deleteOne({ key, expiresAt: { $lte: new Date() } });
    await Visit.create({ key, expiresAt: new Date(Date.now() + 1800000) });
    fresh = true;
  } catch (e: any) {
    if (e.code !== 11000) throw e;
    await Visit.updateOne(
      { key },
      { $set: { expiresAt: new Date(Date.now() + 1800000) } },
    );
  }
  try {
    await Analytics.updateOne(
      { day: day(), path },
      { $inc: { views: 1, sessions: fresh ? 1 : 0 } },
      { upsert: true },
    );
  } catch (error: any) {
    if (error.code !== 11000) throw error;
    await Analytics.updateOne(
      { day: day(), path },
      { $inc: { views: 1, sessions: fresh ? 1 : 0 } },
    );
  }
  res.json({ ok: true });
});
export const adminAnalytics = Router();
adminAnalytics.use(requireAdmin);
adminAnalytics.get("/", async (_req, res) => {
  const [statuses, regions, trend, traffic, overseas] = await Promise.all([
    Membership.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Membership.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$region", count: { $sum: 1 } } },
    ]),
    Membership.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 86400000) } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Karachi",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Analytics.find({
      day: {
        $gte: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
      },
    }).select("-_id day path views sessions"),
    Membership.countDocuments({ country: { $ne: "PK" } }),
  ]);
  res.json({ statuses, regions, trend, traffic, overseas });
});

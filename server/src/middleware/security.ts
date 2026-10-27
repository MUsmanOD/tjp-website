import type { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from "node:crypto";
import { ipKeyGenerator } from "express-rate-limit";
import { Limit } from "../infrastructure/models.js";
import { digest, token } from "../infrastructure/crypto.js";
import { config } from "../config.js";
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public fields: Record<string, string> = {},
  ) {
    super(code);
  }
}
export const cookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
export const cookieName = (name: string) =>
  (config.NODE_ENV === "production" ? "__Host-" : "") + name;
export function csrf(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.get("origin") !== config.CLIENT_ORIGIN)
    throw new ApiError(403, "ORIGIN");
  const cookie = req.cookies[cookieName("csrf")] as string | undefined,
    header = req.get("x-csrf-token");
  if (
    !cookie ||
    !header ||
    !/^[a-f0-9]{64}\.[a-f0-9]{64}$/.test(cookie) ||
    Buffer.byteLength(cookie) !== Buffer.byteLength(header) ||
    !timingSafeEqual(Buffer.from(cookie), Buffer.from(header))
  )
    throw new ApiError(403, "CSRF");
  const [nonce, signature] = cookie.split(".");
  if (!nonce || signature !== digest("csrf:" + nonce))
    throw new ApiError(403, "CSRF");
  next();
}
export function issueCsrf(res: Response, existing?: string) {
  if (
    existing &&
    /^[a-f0-9]{64}\.[a-f0-9]{64}$/.test(existing) &&
    existing.split(".")[1] === digest("csrf:" + existing.split(".")[0])
  )
    return existing;
  const nonce = token(),
    value = nonce + "." + digest("csrf:" + nonce);
  res.cookie(cookieName("csrf"), value, cookieOptions);
  return value;
}
export function rateLimit(
  scope: string,
  maximum: number,
  windowMs: number,
  key?: (req: Request) => string,
  failuresOnly = false,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = Date.now(),
        bucket = Math.floor(now / windowMs),
        identifier =
          digest(
            scope +
              ":" +
              (res.locals.loginRateLimitEpoch
                ? res.locals.loginRateLimitEpoch + ":"
                : "") +
              (key ? key(req) : ipKeyGenerator(req.ip || "127.0.0.1", 56)),
          ) +
          ":" +
          bucket;
      let row;
      try {
        row = await Limit.findOneAndUpdate(
          { key: identifier },
          {
            $inc: { count: 1 },
            $setOnInsert: { expiresAt: new Date((bucket + 1) * windowMs) },
          },
          { upsert: true, returnDocument: "after" },
        );
      } catch (error: any) {
        if (error.code !== 11000) throw error;
        row = await Limit.findOneAndUpdate(
          { key: identifier },
          { $inc: { count: 1 } },
          { returnDocument: "after" },
        );
      }
      if (!row || Number(row.count) > maximum) {
        res.set(
          "Retry-After",
          String(Math.ceil(((bucket + 1) * windowMs - now) / 1000)),
        );
        throw new ApiError(429, "RATE_LIMIT");
      }
      if (failuresOnly)
        res.once("finish", () => {
          if (res.statusCode < 400)
            void Limit.updateOne(
              { key: identifier, count: { $gt: 0 } },
              { $inc: { count: -1 } },
            ).catch(() => {});
        });
      next();
    } catch (error) {
      next(error);
    }
  };
}

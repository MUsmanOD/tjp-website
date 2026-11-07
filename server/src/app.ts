import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { ZodError } from "zod";
import { config } from "./config.js";
import { ApiError, csrf, rateLimit } from "./middleware/security.js";
import { authRouter } from "./modules/auth.js";
import { geographyRouter } from "./modules/geography.js";
import {
  publicMemberships,
  adminMemberships,
} from "./modules/memberships/routes.js";
import { analyticsRouter, adminAnalytics } from "./modules/analytics.js";
import { adminWebsite, publicWebsite } from "./modules/website.js";
export const app = express();
app.disable("x-powered-by");
app.set(
  "trust proxy",
  config.TRUST_PROXY ? config.TRUST_PROXY.split(",") : false,
);
app.use(helmet());
app.use((_req, res, next) => {
  res.set("X-Request-ID", randomUUID());
  res.set("Cache-Control", "no-store");
  next();
});
app.use(cookieParser());
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/ready", (_req, res) =>
  res
    .status(mongoose.connection.readyState === 1 ? 200 : 503)
    .json({ ready: mongoose.connection.readyState === 1 }),
);
app.use("/api/v1", rateLimit("global", 300, 60000), csrf);
app.use("/api/v1/admin/website", adminWebsite);
app.use(express.json({ limit: "16kb" }));
app.use("/api/v1/website", publicWebsite);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/locations", geographyRouter);
app.use(
  "/api/v1/memberships",
  rateLimit("membership", config.MEMBERSHIP_LIMIT, 3600000),
  publicMemberships,
);
app.use("/api/v1/admin/memberships", adminMemberships);
app.use(
  "/api/v1/analytics",
  rateLimit("analytics", 60, 60000),
  analyticsRouter,
);
app.use("/api/v1/admin/analytics", adminAnalytics);
app.use((_req, _res, next) => next(new ApiError(404, "NOT_FOUND")));
app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    let status = 500,
      code = "INTERNAL",
      fields: Record<string, string> = {};
    if (error instanceof ApiError) {
      status = error.status;
      code = error.code;
      fields = error.fields;
    } else if (error instanceof ZodError) {
      status = 422;
      code = "VALIDATION";
      for (const issue of error.issues)
        fields[issue.path.join(".")] =
          issue.code === "custom" ? issue.message : "INVALID";
    } else if (
      error.type === "entity.parse.failed" ||
      error.type === "entity.too.large" ||
      error.type === "encoding.unsupported"
    ) {
      status = error.status;
      code = "INVALID";
    }
    if (status === 500)
      console.error(
        JSON.stringify({ requestId: res.get("X-Request-ID"), code }),
      );
    res
      .status(status)
      .json({ code, fields, requestId: res.get("X-Request-ID") });
  },
);

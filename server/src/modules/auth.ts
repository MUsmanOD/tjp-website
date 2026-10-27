import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import argon2 from "argon2";
import { SignJWT, jwtVerify } from "jose";
import { TOTP, Secret } from "otpauth";
import { z } from "zod";
import {
  Admin,
  Session,
  Challenge,
  Audit,
  audit,
} from "../infrastructure/models.js";
import { seal, unseal, token, digest } from "../infrastructure/crypto.js";
import { config } from "../config.js";
import {
  ApiError,
  cookieOptions,
  cookieName,
  issueCsrf,
  rateLimit,
} from "../middleware/security.js";
const key = new TextEncoder().encode(config.TOKEN_KEY);
const dummyHash = await argon2.hash(token(), { type: argon2.argon2id });
const credentials = z
  .object({ email: z.email(), password: z.string().min(1).max(256) })
  .strict();
const totp = (secret: string) =>
  new TOTP({
    issuer: "TJP",
    label: "Administrator",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
async function verifyFactor(admin: any, code: string) {
  if (!admin.mfaEnabled || !admin.totp) return false;
  if (/^\d{6}$/.test(code)) {
    const delta = totp(unseal<string>(admin.totp, "admin-totp")).validate({
      token: code,
      window: 1,
    });
    if (delta === null) return false;
    const step = Math.floor(Date.now() / 30000) + delta;
    return !!(await Admin.findOneAndUpdate(
      {
        _id: admin._id,
        totp: admin.totp,
        password: admin.password,
        lastStep: { $lt: step },
      },
      { $set: { lastStep: step } },
    ));
  }
  const result = await Admin.updateOne(
    { _id: admin._id, password: admin.password, recovery: digest(code) },
    { $pull: { recovery: digest(code) } },
  );
  return result.modifiedCount === 1;
}
async function setTokens(res: Response, session: any, refresh: string) {
  const access = await new SignJWT({ sid: String(session._id) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(session.adminId))
    .setIssuer("tjp-api")
    .setAudience("tjp-admin")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);
  res.cookie(cookieName("access"), access, {
    ...cookieOptions,
    maxAge: 300000,
  });
  res.cookie(cookieName("refresh"), refresh, {
    ...cookieOptions,
    maxAge: Math.max(0, session.expiresAt.getTime() - Date.now()),
  });
}
async function signIn(req: Request, res: Response, admin: any) {
  const refresh = token();
  const session = await Session.create({
    adminId: admin._id,
    securityVersion: admin.securityVersion,
    refreshHash: digest(refresh),
    usedHashes: [],
    expiresAt: new Date(Date.now() + 43200000),
    lastSeen: new Date(),
  });
  await setTokens(res, session, refresh);
  await audit(String(admin._id), "login", String(session._id));
  res.json({
    authenticated: true,
    csrf: issueCsrf(res, req.cookies[cookieName("csrf")]),
  });
}
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { payload } = await jwtVerify(
      req.cookies[cookieName("access")] || "",
      key,
      { algorithms: ["HS256"], issuer: "tjp-api", audience: "tjp-admin" },
    );
    const session = await Session.findOneAndUpdate(
      {
        _id: payload.sid,
        adminId: payload.sub,
        revoked: false,
        expiresAt: { $gt: new Date() },
        lastSeen: { $gt: new Date(Date.now() - 1800000) },
      },
      { $set: { lastSeen: new Date() } },
      { returnDocument: "after" },
    );
    if (!session) throw new Error();
    const admin = await Admin.findById(session.adminId).select(
      "securityVersion mfaEnabled",
    );
    if (!admin || admin.securityVersion !== session.securityVersion)
      throw new Error();
    res.locals.session = session;
    res.locals.mfaEnabled = admin.mfaEnabled;
    next();
  } catch {
    next(new ApiError(401, "UNAUTHORIZED"));
  }
}
export function requireStepUp(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    !res.locals.session.stepUpAt ||
    Date.now() - res.locals.session.stepUpAt.getTime() > 300000
  )
    throw new ApiError(403, "STEP_UP");
  next();
}
export const authRouter = Router();
authRouter.get("/csrf", (req, res) =>
  res.json({ token: issueCsrf(res, req.cookies[cookieName("csrf")]) }),
);
authRouter.post(
  "/login",
  async (_req, res, next) => {
    // Provisioning/recovery starts a new login quota. Never use updatedAt here:
    // ordinary MFA/session changes must not reset brute-force protection.
    const account = await Admin.findOne({ singleton: "administrator" }).select(
      "_id authEpoch",
    );
    res.locals.loginRateLimitEpoch = account
      ? account.authEpoch || String(account._id)
      : "unprovisioned";
    next();
  },
  rateLimit("login-ip", 5, 900000, undefined, true),
  rateLimit(
    "login-account",
    5,
    900000,
    (req) => String(req.body?.email || "").toLowerCase(),
    true,
  ),
  async (req, res) => {
    const data = credentials.parse(req.body),
      admin = await Admin.findOne({
        emailHash: digest(data.email.toLowerCase()),
      });
    const validPassword = await argon2.verify(
      admin?.password || dummyHash,
      data.password,
    );
    if (!admin || !validPassword) throw new ApiError(401, "CREDENTIALS");
    if (!admin.mfaEnabled) {
      await signIn(req, res, admin);
      return;
    }
    const challenge = token();
    await Challenge.create({
      adminId: admin._id,
      securityVersion: admin.securityVersion,
      hash: digest(challenge),
      expiresAt: new Date(Date.now() + 300000),
    });
    res.json({ challenge, mfaRequired: true });
  },
);
authRouter.post(
  "/mfa",
  rateLimit("mfa", 5, 900000),
  rateLimit("mfa-challenge", 5, 900000, (req) =>
    String(req.body?.challenge || ""),
  ),
  async (req, res) => {
    const data = z
      .object({
        challenge: z.string().length(64),
        code: z.string().min(6).max(100),
      })
      .strict()
      .parse(req.body);
    const challenge = await Challenge.findOne({
      hash: digest(data.challenge),
      expiresAt: { $gt: new Date() },
    });
    if (!challenge) throw new ApiError(401, "CREDENTIALS");
    const admin = await Admin.findById(challenge.adminId);
    if (
      !admin ||
      !admin.mfaEnabled ||
      admin.securityVersion !== challenge.securityVersion ||
      !(await verifyFactor(admin, data.code))
    )
      throw new ApiError(401, "CREDENTIALS");
    const consumed = await Challenge.deleteOne({ _id: challenge._id });
    if (!consumed.deletedCount) throw new ApiError(401, "CREDENTIALS");
    await signIn(req, res, admin);
  },
);
authRouter.post(
  "/refresh",
  rateLimit("refresh", 60, 60000),
  async (req, res) => {
    const hash = digest(req.cookies[cookieName("refresh")] || ""),
      fresh = token();
    const session = await Session.findOneAndUpdate(
      {
        refreshHash: hash,
        revoked: false,
        expiresAt: { $gt: new Date() },
        lastSeen: { $gt: new Date(Date.now() - 1800000) },
      },
      {
        $set: { refreshHash: digest(fresh), lastSeen: new Date() },
        $push: { usedHashes: hash },
      },
      { returnDocument: "after" },
    );
    if (!session) {
      await Session.updateMany(
        { usedHashes: hash },
        { $set: { revoked: true } },
      );
      await audit("anonymous", "refresh-rejected");
      throw new ApiError(401, "UNAUTHORIZED");
    }
    const admin = await Admin.findById(session.adminId).select(
      "securityVersion",
    );
    if (!admin || admin.securityVersion !== session.securityVersion) {
      await Session.updateOne(
        { _id: session._id },
        { $set: { revoked: true } },
      );
      throw new ApiError(401, "UNAUTHORIZED");
    }
    await setTokens(res, session, fresh);
    res.json({ ok: true });
  },
);
authRouter.use(requireAdmin);
authRouter.get("/me", (_req, res) =>
  res.json({
    id: String(res.locals.session.adminId),
    sessionId: String(res.locals.session._id),
    expiresAt: res.locals.session.expiresAt,
    mfaEnabled: res.locals.mfaEnabled,
  }),
);
authRouter.post("/logout", async (_req, res) => {
  await Session.updateOne(
    { _id: res.locals.session._id },
    { $set: { revoked: true } },
  );
  res.clearCookie(cookieName("access"), cookieOptions);
  res.clearCookie(cookieName("refresh"), cookieOptions);
  res.json({ ok: true });
});
authRouter.post(
  "/step-up",
  rateLimit("step-up", 5, 900000, () => "administrator"),
  async (req, res) => {
    const { password, code } = z
        .object({
          password: z.string().min(1).max(256),
          code: z.string().max(100).optional(),
        })
        .strict()
        .parse(req.body),
      admin = await Admin.findById(res.locals.session.adminId);
    if (
      !admin ||
      admin.securityVersion !== res.locals.session.securityVersion ||
      !(await argon2.verify(String(admin.password), password)) ||
      (admin.mfaEnabled && !(await verifyFactor(admin, code || "")))
    )
      throw new ApiError(401, "CREDENTIALS");
    const confirmed = await Session.updateOne(
      {
        _id: res.locals.session._id,
        revoked: false,
        securityVersion: res.locals.session.securityVersion ?? null,
      },
      { $set: { stepUpAt: new Date() } },
    );
    if (!confirmed.modifiedCount) throw new ApiError(401, "UNAUTHORIZED");
    res.json({ ok: true });
  },
);
authRouter.get("/sessions", async (_req, res) =>
  res.json(
    await Session.find({
      adminId: res.locals.session.adminId,
      revoked: false,
      expiresAt: { $gt: new Date() },
    })
      .select("_id createdAt lastSeen expiresAt")
      .lean(),
  ),
);

// Setup secrets are separate from active MFA and expire without changing login.
authRouter.post(
  "/2fa/setup",
  requireStepUp,
  rateLimit("2fa-setup", 5, 900000, () => "administrator"),
  async (_req, res) => {
    const secret = new Secret({ size: 20 }).base32;
    const admin = await Admin.findOneAndUpdate(
      {
        _id: res.locals.session.adminId,
        mfaEnabled: false,
        securityVersion: res.locals.session.securityVersion ?? null,
      },
      {
        $set: {
          pendingTotp: seal(secret, "admin-totp"),
          pendingTotpExpiresAt: new Date(Date.now() + 600000),
          pendingTotpSession: String(res.locals.session._id),
        },
      },
      { returnDocument: "after" },
    );
    if (!admin) throw new ApiError(409, "STATUS");
    await audit(String(admin._id), "2fa-setup");
    res.json({ secret, uri: totp(secret).toString() });
  },
);
authRouter.delete("/2fa/setup", async (_req, res) => {
  await Admin.updateOne(
    {
      _id: res.locals.session.adminId,
      pendingTotpSession: String(res.locals.session._id),
    },
    {
      $unset: {
        pendingTotp: 1,
        pendingTotpExpiresAt: 1,
        pendingTotpSession: 1,
      },
    },
  );
  res.json({ ok: true });
});
authRouter.post(
  "/2fa/enable",
  requireStepUp,
  rateLimit("2fa-enable", 5, 900000, () => "administrator"),
  async (req, res) => {
    const { code } = z
      .object({ code: z.string().regex(/^\d{6}$/) })
      .strict()
      .parse(req.body);
    const admin = await Admin.findOne({
      _id: res.locals.session.adminId,
      mfaEnabled: false,
      pendingTotpSession: String(res.locals.session._id),
      pendingTotpExpiresAt: { $gt: new Date() },
    });
    if (!admin?.pendingTotp) throw new ApiError(409, "SETUP_EXPIRED");
    const delta = totp(
      unseal<string>(admin.pendingTotp, "admin-totp"),
    ).validate({ token: code, window: 1 });
    if (delta === null) throw new ApiError(401, "CREDENTIALS");
    const recoveryCodes = Array.from({ length: 10 }, token),
      version = token(),
      refresh = token();
    await Admin.db.transaction(async (session) => {
      const changed = await Admin.updateOne(
        {
          _id: admin._id,
          mfaEnabled: false,
          pendingTotp: admin.pendingTotp,
          securityVersion: res.locals.session.securityVersion ?? null,
        },
        {
          $set: {
            mfaEnabled: true,
            totp: admin.pendingTotp,
            lastStep: Math.floor(Date.now() / 30000) + delta,
            recovery: recoveryCodes.map(digest),
            securityVersion: version,
          },
          $unset: {
            pendingTotp: 1,
            pendingTotpExpiresAt: 1,
            pendingTotpSession: 1,
          },
        },
        { session },
      );
      if (!changed.modifiedCount) throw new ApiError(409, "STATUS");
      await Session.updateMany(
        { adminId: admin._id, _id: { $ne: res.locals.session._id } },
        { $set: { revoked: true } },
        { session },
      );
      const kept = await Session.updateOne(
        {
          _id: res.locals.session._id,
          revoked: false,
          securityVersion: res.locals.session.securityVersion ?? null,
        },
        {
          $set: { securityVersion: version, refreshHash: digest(refresh) },
          $push: { usedHashes: res.locals.session.refreshHash },
          $unset: { stepUpAt: 1 },
        },
        { session },
      );
      if (!kept.modifiedCount) throw new ApiError(401, "UNAUTHORIZED");
      await Challenge.deleteMany({ adminId: admin._id }, { session });
      await Audit.create(
        [
          {
            actor: String(admin._id),
            action: "2fa-enabled",
            target: String(admin._id),
          },
        ],
        { session },
      );
    });
    await setTokens(res, res.locals.session, refresh);
    res.json({ mfaEnabled: true, recoveryCodes });
  },
);
authRouter.post(
  "/2fa/disable",
  requireStepUp,
  rateLimit("2fa-disable", 5, 900000, () => "administrator"),
  async (_req, res) => {
    const version = token(),
      refresh = token(),
      id = res.locals.session.adminId;
    await Admin.db.transaction(async (session) => {
      const changed = await Admin.updateOne(
        {
          _id: id,
          mfaEnabled: true,
          securityVersion: res.locals.session.securityVersion ?? null,
        },
        {
          $set: {
            mfaEnabled: false,
            totp: null,
            recovery: [],
            lastStep: -1,
            securityVersion: version,
          },
          $unset: {
            pendingTotp: 1,
            pendingTotpExpiresAt: 1,
            pendingTotpSession: 1,
          },
        },
        { session },
      );
      if (!changed.modifiedCount) throw new ApiError(409, "STATUS");
      await Session.updateMany(
        { adminId: id, _id: { $ne: res.locals.session._id } },
        { $set: { revoked: true } },
        { session },
      );
      const kept = await Session.updateOne(
        {
          _id: res.locals.session._id,
          revoked: false,
          securityVersion: res.locals.session.securityVersion ?? null,
        },
        {
          $set: { securityVersion: version, refreshHash: digest(refresh) },
          $push: { usedHashes: res.locals.session.refreshHash },
          $unset: { stepUpAt: 1 },
        },
        { session },
      );
      if (!kept.modifiedCount) throw new ApiError(401, "UNAUTHORIZED");
      await Challenge.deleteMany({ adminId: id }, { session });
      await Audit.create(
        [{ actor: String(id), action: "2fa-disabled", target: String(id) }],
        { session },
      );
    });
    await setTokens(res, res.locals.session, refresh);
    res.json({ mfaEnabled: false });
  },
);
authRouter.delete("/sessions/:id", requireStepUp, async (req, res) => {
  if (!/^[a-f0-9]{24}$/.test(String(req.params.id)))
    throw new ApiError(400, "INVALID");
  await Session.updateOne(
    { _id: req.params.id, adminId: res.locals.session.adminId },
    { $set: { revoked: true } },
  );
  await audit(
    String(res.locals.session.adminId),
    "revoke-session",
    String(req.params.id),
  );
  res.json({ ok: true });
});

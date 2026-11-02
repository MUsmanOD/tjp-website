import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import argon2 from "argon2";
import { TOTP, Secret } from "otpauth";
const random = () => randomBytes(32).toString("hex");
process.env.NODE_ENV = "test";
process.env.DATA_KEYS = JSON.stringify({ "1": random() });
process.env.HASH_KEY = random();
process.env.TOKEN_KEY = random();
process.env.CURRENT_KEY = "1";
process.env.CLIENT_ORIGIN = "http://localhost:3000";
process.env.TRUST_PROXY = "";
const database = "tjp_test_" + randomUUID().replaceAll("-", "");
process.env.MONGODB_URI =
  (process.env.TEST_MONGODB_BASE || "mongodb://127.0.0.1:27027") +
  "/" +
  database +
  "?replicaSet=" + encodeURIComponent(process.env.TEST_MONGODB_REPLICA_SET || "rs0");
const { app } = await import("../src/app.js");
const { Admin, Membership, Session, Audit, Limit, Analytics } =
  await import("../src/infrastructure/models.js");
const { digest, seal, unseal } =
  await import("../src/infrastructure/crypto.js");
const { membershipSchema } =
  await import("../src/modules/memberships/schema.js");
let servers: any[] = [],
  base: string;
const password = "test-only-long-password";
before(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
  for (let i = 0; i < 2; i++) {
    const server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    servers.push(server);
  }
  base = "http://127.0.0.1:" + servers[0].address().port;
  await Admin.create({
    emailHash: digest("admin@example.test"),
    email: seal("admin@example.test", "admin-email"),
    password: await argon2.hash(password),
  });
});
after(async () => {
  await Promise.all(
    servers.map((server) => new Promise((resolve) => server.close(resolve))),
  );
  if (mongoose.connection.name === database)
    await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
class Browser {
  cookies: Record<string, string> = {};
  csrf = "";
  async request(
    path: string,
    body?: unknown,
    options: {
      method?: string;
      headers?: Record<string, string>;
      base?: string;
    } = {},
  ) {
    const response = await fetch((options.base || base) + path, {
      method: options.method || (body ? "POST" : "GET"),
      headers: {
        Origin: "http://localhost:3000",
        Cookie: Object.entries(this.cookies)
          .map(([k, v]) => k + "=" + v)
          .join("; "),
        "Content-Type": "application/json",
        "X-CSRF-Token": this.csrf,
        ...options.headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    for (const cookie of response.headers.getSetCookie()) {
      const [pair] = cookie.split(";");
      const index = pair.indexOf("=");
      this.cookies[pair.slice(0, index)] = pair.slice(index + 1);
    }
    const data = await response.json();
    if (data.csrf) this.csrf = data.csrf;
    return { status: response.status, data, response };
  }
  async init() {
    this.csrf = (await this.request("/api/v1/auth/csrf")).data.token;
    return this;
  }
}
const application = {
  name: "Test Applicant",
  email: "applicant@example.test",
  phone: "",
  identity: "35202-1234567-1",
  identityType: "cnic",
  ageGroup: "under18",
  age: 16,
  gender: "female",
  religiousCommunity: "muslim",
  country: "PK",
  region: "punjab",
  district: "punjab:lahore",
  locality: "Test Village",
  localityManual: true,
  union: "UC 12",
  ward: "",
  national: "NA-120",
  assembly: "PP-150",
  occupation: "",
  interests: "",
  consent: true,
};
let recovery: string[] = [],
  admin: Browser,
  member: any;
test("health, readiness and authorization are enforced", async () => {
  const b = await new Browser().init();
  assert.equal((await b.request("/api/health")).status, 200);
  assert.equal((await b.request("/api/ready")).status, 200);
  assert.equal((await b.request("/api/v1/admin/memberships")).status, 401);
  assert.equal(
    (
      await b.request("/api/v1/memberships", application, {
        headers: { "X-CSRF-Token": "" },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await b.request("/api/v1/memberships", application, {
        headers: { Origin: "https://evil.test" },
      })
    ).status,
    403,
  );
});
test("validation accepts contact alternatives, optional ID, minors and regional exceptions", () => {
  assert.equal(
    membershipSchema.parse({ ...application, identity: "" }).ageGroup,
    "under18",
  );
  assert.ok(
    membershipSchema.safeParse({
      ...application,
      email: "",
      phone: "03001234567",
    }).success,
  );
  assert.ok(
    !membershipSchema.safeParse({ ...application, email: "", phone: "" })
      .success,
  );
  assert.ok(
    !membershipSchema.safeParse({
      ...application,
      email: "bad",
      phone: "03001234567",
    }).success,
  );
  assert.ok(
    !membershipSchema.safeParse({ ...application, identity: "123" }).success,
  );
  assert.equal(
    membershipSchema.parse({ ...application, identity: "۳۵۲۰۲۱۲۳۴۵۶۷۱" })
      .identity,
    "3520212345671",
  );
  assert.ok(
    !membershipSchema.safeParse({ ...application, region: "sindh" }).success,
  );
  assert.ok(
    !membershipSchema.safeParse({ ...application, status: "approved" }).success,
  );
  assert.ok(
    membershipSchema.safeParse({
      ...application,
      region: "ict",
      district: "ict:islamabad",
      national: "NA-46",
      assembly: "",
    }).success,
  );
  assert.ok(
    membershipSchema.safeParse({
      ...application,
      region: "ajk",
      district: "Muzaffarabad",
      districtManual: true,
      national: "",
      assembly: "LA-1",
      assemblyManual: true,
    }).success,
  );
  assert.ok(
    !membershipSchema.safeParse({ ...application, country: "GB" }).success,
  );
  assert.ok(
    membershipSchema.safeParse({
      ...application,
      country: "GB",
      overseasCity: "London",
    }).success,
  );
});
test("submission is encrypted, pending, idempotent and allows shared contacts", async () => {
  const b = await new Browser().init(),
    key = randomUUID();
  const first = await b.request("/api/v1/memberships", application, {
    headers: { "Idempotency-Key": key },
  });
  assert.equal(first.status, 202, JSON.stringify(first.data));
  assert.equal(
    (
      await b.request("/api/v1/memberships", application, {
        headers: { "Idempotency-Key": key },
      })
    ).data.reference,
    first.data.reference,
  );
  assert.equal(
    (
      await b.request(
        "/api/v1/memberships",
        { ...application, name: "Changed" },
        { headers: { "Idempotency-Key": key } },
      )
    ).status,
    409,
  );
  member = await Membership.findOne({ reference: first.data.reference });
  assert.equal(member.status, "pending");
  assert.ok(!JSON.stringify(member.toObject()).includes("Test Applicant"));
  assert.equal(
    unseal<any>(member.privateData, String(member._id)).name,
    application.name,
  );
  assert.throws(() => unseal(member.privateData, "wrong-record"));
  assert.equal(
    (
      await b.request(
        "/api/v1/memberships",
        { ...application, name: "Family Member", identity: "" },
        { headers: { "Idempotency-Key": randomUUID() } },
      )
    ).status,
    202,
  );
});
test("password-only login and optional MFA setup, enablement and challenge replay protection", async () => {
  admin = await new Browser().init();
  const credentials = { email: "admin@example.test", password };
  const login = await admin.request("/api/v1/auth/login", credentials);
  assert.equal(login.status, 200);
  assert.equal(login.data.authenticated, true);
  assert.equal(login.data.secret, undefined);
  assert.equal(login.data.challenge, undefined);
  assert.equal((await admin.request("/api/v1/auth/me")).data.mfaEnabled, false);
  assert.equal((await admin.request("/api/v1/auth/2fa/setup", {})).status, 403);
  assert.equal(
    (await admin.request("/api/v1/auth/step-up", { password })).status,
    200,
  );
  const setup = await admin.request("/api/v1/auth/2fa/setup", {});
  assert.equal(setup.status, 200);
  assert.equal((await admin.request("/api/v1/auth/me")).data.mfaEnabled, false);
  const other = await new Browser().init();
  await other.request("/api/v1/auth/login", credentials);
  assert.equal(
    (await other.request("/api/v1/auth/2fa/enable", { code: "000000" })).status,
    403,
  );
  const otp = new TOTP({ secret: Secret.fromBase32(setup.data.secret) });
  const invalidCode = String((Number(otp.generate()) + 1) % 1000000).padStart(
    6,
    "0",
  );
  assert.equal(
    (await admin.request("/api/v1/auth/2fa/enable", { code: invalidCode }))
      .status,
    401,
  );
  assert.equal((await admin.request("/api/v1/auth/me")).data.mfaEnabled, false);
  const enabled = await admin.request("/api/v1/auth/2fa/enable", {
    code: otp.generate(),
  });
  assert.equal(enabled.status, 200, JSON.stringify(enabled.data));
  recovery = enabled.data.recoveryCodes;
  assert.equal(recovery.length, 10);
  assert.equal((await other.request("/api/v1/auth/me")).status, 401);
  assert.equal((await other.request("/api/v1/auth/refresh", {})).status, 401);
  assert.equal((await admin.request("/api/v1/auth/me")).data.mfaEnabled, true);
  const challenge = await other.request("/api/v1/auth/login", credentials);
  assert.equal(challenge.data.mfaRequired, true);
  assert.equal(challenge.data.secret, undefined);
  assert.equal(
    (
      await other.request("/api/v1/auth/mfa", {
        challenge: challenge.data.challenge,
        code: otp.generate(),
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await other.request("/api/v1/auth/mfa", {
        challenge: challenge.data.challenge,
        code: recovery[9],
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await other.request("/api/v1/auth/mfa", {
        challenge: challenge.data.challenge,
        code: recovery[9],
      })
    ).status,
    401,
  );
  assert.equal(
    (await admin.request("/api/v1/auth/step-up", { password })).status,
    401,
  );
  assert.ok(!JSON.stringify(await Admin.findOne()).includes(recovery[0]));
});
test("profiles mask IDs, flag duplicates, require step-up and preserve IDs on corrections", async () => {
  const profile = await admin.request(
    "/api/v1/admin/memberships/" + member._id,
  );
  assert.equal(profile.status, 200);
  assert.match(profile.data.identity, /^\*/);
  assert.equal(profile.data.duplicates.length, 1);
  assert.equal(
    (
      await admin.request(
        "/api/v1/admin/memberships/" + member._id + "/reveal",
        {},
        {},
      )
    ).status,
    403,
  );
  const { identity, ...edit } = application;
  const saved = await admin.request(
    "/api/v1/admin/memberships/" + member._id,
    { ...edit, name: "Corrected" },
    { method: "PATCH", headers: { "If-Match": profile.data.updatedAt } },
  );
  assert.equal(saved.status, 200, JSON.stringify(saved.data));
  const row = await Membership.findById(member._id);
  assert.equal(
    unseal<any>(String(row!.privateData), String(row!._id)).identity,
    "3520212345671",
  );
  assert.equal(
    (
      await admin.request("/api/v1/admin/memberships/" + member._id, edit, {
        method: "PATCH",
        headers: { "If-Match": profile.data.updatedAt },
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await admin.request("/api/v1/auth/step-up", {
        password,
        code: recovery[0],
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await admin.request("/api/v1/auth/step-up", {
        password,
        code: recovery[0],
      })
    ).status,
    401,
  );
  const reveal = await admin.request(
    "/api/v1/admin/memberships/" + member._id + "/reveal",
    {},
  );
  assert.equal(reveal.data.identity, "3520212345671");
});
test("approval, archive, restoration, exact search and geographic counts", async () => {
  const url = "/api/v1/admin/memberships/" + member._id;
  assert.equal(
    (await admin.request(url + "/status", { status: "approved" })).status,
    200,
  );
  const before = await Membership.findById(member._id);
  assert.ok(before!.membershipNumber);
  assert.equal(
    (await admin.request(url + "/status", { status: "archived" })).status,
    200,
  );
  assert.equal(
    (await admin.request(url + "/status", { status: "approved" })).status,
    409,
  );
  assert.equal(
    (await admin.request(url + "/status", { status: "restore" })).status,
    200,
  );
  assert.equal(
    (await Membership.findById(member._id))!.membershipNumber,
    before!.membershipNumber,
  );
  assert.equal(
    (await admin.request("/api/v1/admin/memberships/tree?group=region")).data[0]
      .count,
    2,
  );
  assert.equal(
    (
      await admin.request("/api/v1/admin/memberships/search", {
        field: "email",
        value: application.email,
      })
    ).data.rows.length,
    2,
  );
  assert.equal(
    (await admin.request("/api/v1/admin/memberships?status[$ne]=pending"))
      .status,
    422,
  );
});
test("analytics stores aggregates and rejects arbitrary paths and personal values", async () => {
  const b = await new Browser().init();
  assert.equal(
    (await b.request("/api/v1/analytics/events", { path: "/membership" }))
      .status,
    200,
  );
  await b.request("/api/v1/analytics/events", { path: "/membership" });
  assert.equal(
    (await b.request("/api/v1/analytics/events", { path: "/admin" })).status,
    422,
  );
  assert.equal(
    (
      await b.request("/api/v1/analytics/events", {
        path: "/",
        email: "private",
      })
    ).status,
    422,
  );
  const row = await Analytics.findOne({ path: "/membership" });
  assert.equal(row!.views, 2);
  assert.equal(row!.sessions, 1);
  const overview = await admin.request("/api/v1/admin/analytics");
  assert.equal(overview.status, 200);
  const expectedUnder18 = await Membership.countDocuments({ ageGroup: "under18" });
  assert.equal(overview.data.ageGroups.find((group: any) => group._id === "under18")?.count || 0, expectedUnder18);
  assert.ok(!JSON.stringify(overview.data).includes(application.email));
});
test("permanent removal requires MFA and leaves no personal audit values", async () => {
  const response = await admin.request(
    "/api/v1/admin/memberships/" + member._id,
    undefined,
    { method: "DELETE" },
  );
  assert.equal(response.status, 200);
  assert.equal(await Membership.countDocuments({ _id: member._id }), 0);
  const history = await Audit.find({ target: String(member._id) });
  assert.equal(history.length, 1);
  assert.equal(history[0].action, "removed");
  assert.ok(!JSON.stringify(history).includes("Corrected"));
});
test("refresh rotates tokens, rejects reuse and revokes the session", async () => {
  const old = admin.cookies.refresh;
  assert.equal((await admin.request("/api/v1/auth/refresh", {})).status, 200);
  assert.notEqual(admin.cookies.refresh, old);
  const stolen = await new Browser().init();
  stolen.cookies.refresh = old;
  assert.equal((await stolen.request("/api/v1/auth/refresh", {})).status, 401);
  assert.equal((await admin.request("/api/v1/auth/me")).status, 401);
});
test("idle and absolute expiry invalidate access; logout revokes tokens", async () => {
  await Limit.deleteMany({});
  const b = await new Browser().init();
  const login = await b.request("/api/v1/auth/login", {
    email: "admin@example.test",
    password,
  });
  await b.request("/api/v1/auth/mfa", {
    challenge: login.data.challenge,
    code: recovery[1],
  });
  const me = await b.request("/api/v1/auth/me");
  assert.equal(me.status, 200);
  await Session.updateOne(
    { _id: me.data.sessionId },
    { $set: { lastSeen: new Date(Date.now() - 1800001) } },
  );
  assert.equal((await b.request("/api/v1/auth/me")).status, 401);
  await Session.updateOne(
    { _id: me.data.sessionId },
    { $set: { lastSeen: new Date(), expiresAt: new Date(Date.now() - 1) } },
  );
  assert.equal((await b.request("/api/v1/auth/refresh", {})).status, 401);
  await Session.updateOne(
    { _id: me.data.sessionId },
    { $set: { expiresAt: new Date(Date.now() + 600000) } },
  );
  assert.equal((await b.request("/api/v1/auth/logout", {})).status, 200);
  assert.equal((await b.request("/api/v1/auth/me")).status, 401);
});
test("submission limits are shared across API processes", async () => {
  await Limit.deleteMany({});
  const b = await new Browser().init();
  const other = "http://127.0.0.1:" + servers[1].address().port;
  for (let i = 0; i < 10; i++)
    assert.equal(
      (
        await b.request(
          "/api/v1/memberships",
          {},
          { base: i % 2 ? other : base },
        )
      ).status,
      422,
    );
  const limited = await b.request("/api/v1/memberships", {}, { base: other });
  assert.equal(limited.status, 429);
  assert.ok(limited.response.headers.get("retry-after"));
});

test("2FA can be disabled securely; pending setup can be cancelled or expire", async () => {
  await Limit.deleteMany({});
  const b = await new Browser().init(),
    credentials = { email: "admin@example.test", password };
  const login = await b.request("/api/v1/auth/login", credentials);
  await b.request("/api/v1/auth/mfa", {
    challenge: login.data.challenge,
    code: recovery[2],
  });
  assert.equal((await b.request("/api/v1/auth/2fa/disable", {})).status, 403);
  assert.equal(
    (await b.request("/api/v1/auth/step-up", { password })).status,
    401,
  );
  assert.equal(
    (await b.request("/api/v1/auth/step-up", { password, code: recovery[3] }))
      .status,
    200,
  );
  const stale = await new Browser().init();
  const staleChallenge = await stale.request("/api/v1/auth/login", credentials);
  assert.equal((await b.request("/api/v1/auth/2fa/disable", {})).status, 200);
  assert.equal((await b.request("/api/v1/auth/me")).data.mfaEnabled, false);
  assert.equal(
    (
      await stale.request("/api/v1/auth/mfa", {
        challenge: staleChallenge.data.challenge,
        code: recovery[4],
      })
    ).status,
    401,
  );
  const stored = await Admin.findOne();
  assert.equal(stored!.totp, null);
  assert.deepEqual(stored!.recovery, []);
  const newLogin = await stale.request("/api/v1/auth/login", credentials);
  assert.equal(newLogin.data.authenticated, true);
  assert.equal(
    (await b.request("/api/v1/auth/step-up", { password })).status,
    200,
  );
  assert.equal((await b.request("/api/v1/auth/2fa/setup", {})).status, 200);
  assert.equal(
    (await b.request("/api/v1/auth/2fa/setup", undefined, { method: "DELETE" }))
      .status,
    200,
  );
  assert.equal(
    (await b.request("/api/v1/auth/2fa/enable", { code: "123456" })).status,
    409,
  );
  const setup = await b.request("/api/v1/auth/2fa/setup", {});
  await Admin.updateOne(
    {},
    { $set: { pendingTotpExpiresAt: new Date(Date.now() - 1) } },
  );
  assert.equal(
    (
      await b.request("/api/v1/auth/2fa/enable", {
        code: new TOTP({
          secret: Secret.fromBase32(setup.data.secret),
        }).generate(),
      })
    ).status,
    409,
  );
  assert.equal(
    (await stale.request("/api/v1/auth/login", credentials)).data.authenticated,
    true,
  );
});
test("first provisioned login ignores pre-account failures; ordinary account updates never reset the limit", async () => {
  await Admin.deleteMany({}); // Disposable test database only.
  await Limit.deleteMany({});
  const browser = await new Browser().init();
  const credentials = { email: "fresh@example.test", password };
  for (let i = 0; i < 5; i++)
    assert.equal(
      (await browser.request("/api/v1/auth/login", credentials)).status,
      401,
    );
  assert.equal(
    (await browser.request("/api/v1/auth/login", credentials)).status,
    429,
  );
  const fresh = await Admin.create({
    emailHash: digest(credentials.email),
    email: seal(credentials.email, "admin-email"),
    password: await argon2.hash(password),
  });
  // Old deployments did not set authEpoch. The immutable administrator ID is
  // the compatibility fallback and must distinguish pre-provisioning failures.
  for (let i = 0; i < 7; i++)
    assert.equal(
      (await browser.request("/api/v1/auth/login", credentials)).status,
      200,
    );
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await browser.request("/api/v1/auth/login", {
          ...credentials,
          password: "incorrect",
        })
      ).status,
      401,
    );
  await Admin.updateOne({ _id: fresh._id }, { $set: { lastStep: 1 } });
  const blocked = await browser.request("/api/v1/auth/login", credentials);
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.response.headers.get("retry-after")) > 0);
  // Only the host recovery command explicitly creates a new quota generation.
  await Admin.updateOne({ _id: fresh._id }, { $set: { authEpoch: random() } });
  assert.equal(
    (await browser.request("/api/v1/auth/login", credentials)).status,
    200,
  );
});

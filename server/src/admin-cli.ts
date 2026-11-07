import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import argon2 from "argon2";
import mongoose from "mongoose";
import { z } from "zod";
import { config } from "./config.js";
import { Admin, Session, Challenge, audit } from "./infrastructure/models.js";
import { digest, seal, token } from "./infrastructure/crypto.js";
let muted = false;
const output = new Writable({
  write(chunk, _encoding, callback) {
    if (!muted) process.stdout.write(chunk);
    callback();
  },
});
const terminal = createInterface({
  input: process.stdin,
  output,
  terminal: true,
});
try {
  const email = z
    .email()
    .parse(
      (await terminal.question("Administrator email: ")).trim().toLowerCase(),
    );
  process.stdout.write("New password (at least 14 characters; hidden): ");
  muted = true;
  const password = await terminal.question("");
  muted = false;
  process.stdout.write("\n");
  z.string().min(14).max(256).parse(password);
  await mongoose.connect(config.MONGODB_URI);
  await Admin.init();
  const existing = await Admin.findOne({ singleton: "administrator" });
  if (existing && process.argv[2] !== "recover")
    throw new Error("Administrator already exists. Use admin:recover.");
  const values = {
    authEpoch: token(),
    securityVersion: token(),
    pendingTotp: null,
    pendingTotpExpiresAt: null,
    pendingTotpSession: null,
    emailHash: digest(email),
    email: seal(email, "admin-email"),
    password: await argon2.hash(password, { type: argon2.argon2id }),
    mfaEnabled: false,
    totp: null,
    recovery: [],
    lastStep: -1,
  };
  const admin = existing
    ? await Admin.findByIdAndUpdate(
        existing._id,
        { $set: values },
        { returnDocument: "after" },
      )
    : await Admin.create(values);
  await Session.updateMany({}, { $set: { revoked: true } });
  await Challenge.deleteMany({});
  await audit(
    "host",
    existing ? "admin-recovery" : "admin-created",
    String(admin!._id),
  );
  console.info(
    "Administrator saved. Sign in at /tjp-portal-pubjab-0001-login. Optional 2FA is available under Security in the admin panel.",
  );
} finally {
  terminal.close();
  await mongoose.disconnect();
}

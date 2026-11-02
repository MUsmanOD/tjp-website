import argon2 from "argon2";
import mongoose from "mongoose";
import { z } from "zod";
import { config } from "./config.js";
import { Admin, audit } from "./infrastructure/models.js";
import { digest, seal, token } from "./infrastructure/crypto.js";

const email = z.email().parse(process.env.ADMIN_EMAIL?.trim().toLowerCase());
const password = z.string().min(14).max(256).parse(process.env.ADMIN_PASSWORD);

try {
  await mongoose.connect(config.MONGODB_URI);
  await Admin.init();
  if (await Admin.exists({ singleton: "administrator" })) {
    console.info("Administrator already exists; no changes made. Use admin:recover to reset credentials.");
  } else {
    const admin = await Admin.create({
      authEpoch: token(),
      securityVersion: token(),
      emailHash: digest(email),
      email: seal(email, "admin-email"),
      password: await argon2.hash(password, { type: argon2.argon2id }),
      mfaEnabled: false,
      totp: null,
      recovery: [],
      lastStep: -1,
    });
    await audit("host", "admin-created", String(admin._id));
    console.info("Administrator created. Sign in at /admin/login.");
  }
} finally {
  await mongoose.disconnect();
}

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "node:crypto";
import { config, dataKeys } from "../config.js";
export const token = () => randomBytes(32).toString("hex");
export const digest = (value: string) =>
  createHmac("sha256", config.HASH_KEY).update(value).digest("hex");
export function seal(value: unknown, context: string) {
  const iv = randomBytes(12),
    cipher = createCipheriv(
      "aes-256-gcm",
      Buffer.from(dataKeys[config.CURRENT_KEY], "hex"),
      iv,
    );
  cipher.setAAD(Buffer.from(context));
  const body = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return [
    config.CURRENT_KEY,
    iv.toString("hex"),
    cipher.getAuthTag().toString("hex"),
    body.toString("hex"),
  ].join(".");
}
export function unseal<T = any>(value: string, context: string): T {
  const [version, iv, tag, body] = value.split(".");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    Buffer.from(dataKeys[version], "hex"),
    Buffer.from(iv, "hex"),
  );
  decipher.setAAD(Buffer.from(context));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  return JSON.parse(
    Buffer.concat([
      decipher.update(Buffer.from(body, "hex")),
      decipher.final(),
    ]).toString(),
  );
}

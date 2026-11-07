import { createHash } from "node:crypto";
import { config } from "../config.js";
import { ApiError } from "../middleware/security.js";

const maxBytes = 2 * 1024 * 1024;
const assetId = (version: string) => "tjp-website-" + version;
const timestamp = () => String(Math.floor(Date.now() / 1000));

function credentials() {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = config;
  if (!cloud || !key || !secret) throw new ApiError(503, "CLOUDINARY_NOT_CONFIGURED");
  return { url: `https://api.cloudinary.com/v1_1/${cloud}/image/`, key, secret };
}

function signed<T extends Record<string, string>>(fields: T, key: string, secret: string) {
  const input = Object.keys(fields).sort().map((name) => `${name}=${fields[name]}`).join("&");
  const signature = createHash("sha256").update(input + secret).digest("hex");
  return { ...fields, api_key: key, signature };
}

export async function uploadWebsiteImage(version: string, bytes: Buffer) {
  const { url, key, secret } = credentials();
  const fields = signed({
    timestamp: timestamp(), public_id: assetId(version), type: "authenticated", overwrite: "false",
  }, key, secret);
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) form.set(name, value);
  form.set("file", new Blob([new Uint8Array(bytes)], { type: "image/webp" }), "asset.webp");
  try {
    const response = await fetch(url + "upload", {
      method: "POST", body: form, redirect: "error", signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error();
    const asset = await response.json();
    if (asset.public_id !== fields.public_id || asset.type !== "authenticated" || asset.format !== "webp") throw new Error();
  } catch {
    throw new ApiError(502, "MEDIA_UNAVAILABLE");
  }
}

export async function downloadWebsiteImage(version: string) {
  const { url, key, secret } = credentials();
  const now = timestamp();
  const query = new URLSearchParams(signed({
    timestamp: now, expires_at: String(Number(now) + 30),
    public_id: assetId(version), format: "webp", type: "authenticated",
  }, key, secret));
  try {
    const response = await fetch(url + "download?" + query, {
      redirect: "error", signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok || !response.body || response.headers.get("content-type")?.split(";")[0] !== "image/webp") throw new Error();
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) throw new Error();
        chunks.push(value);
      }
    } finally {
      await reader.cancel().catch(() => {});
    }
    if (!size) throw new Error();
    return Buffer.concat(chunks, size);
  } catch {
    throw new ApiError(502, "MEDIA_UNAVAILABLE");
  }
}

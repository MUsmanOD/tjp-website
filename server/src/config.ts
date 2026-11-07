import "dotenv/config";
import { z } from "zod";
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5027),
  MONGODB_URI: z.string().min(1),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:3000"),
  DATA_KEYS: z.string().min(1),
  CURRENT_KEY: z.string().default("1"),
  HASH_KEY: z.string().regex(/^[a-f0-9]{64}$/i),
  TOKEN_KEY: z.string().regex(/^[a-f0-9]{64}$/i),
  TRUST_PROXY: z.string().default(""),
  MEMBERSHIP_LIMIT: z.coerce.number().int().positive().default(10),
  CLOUDINARY_CLOUD_NAME: z.string().regex(/^[a-zA-Z0-9_-]*$/).default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),
});
export const config = schema.parse(process.env);
export const dataKeys = JSON.parse(config.DATA_KEYS) as Record<string, string>;
for (const key of Object.values(dataKeys))
  if (!/^[a-f0-9]{64}$/i.test(key))
    throw new Error("Data keys must be 32-byte hex keys");
if (!dataKeys[config.CURRENT_KEY])
  throw new Error("Current encryption key missing");
if (
  config.NODE_ENV === "production" &&
  !config.CLIENT_ORIGIN.startsWith("https://")
)
  throw new Error("Production requires HTTPS");

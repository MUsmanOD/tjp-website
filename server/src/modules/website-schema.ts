import { z } from "zod";
import { ApiError } from "../middleware/security.js";

const short = (max: number) => z.string().trim().min(1).max(max);
const optional = (max: number) => z.string().trim().max(max);
const localized = (max: number) => z.strictObject({ en: short(max), ur: optional(max) });
const optionalLocalized = (max: number) => z.strictObject({ en: optional(max), ur: optional(max) });

const httpsUrl = (hosts?: string[]) => z.union([
  z.literal(""),
  z.string().max(500).refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password &&
        (!hosts || hosts.includes(url.hostname));
    } catch {
      return false;
    }
  }),
]);

const image = z.string().max(Math.ceil((2 * 1024 * 1024) / 3) * 4).optional();
const publishFields = { image, published: z.boolean(), order: z.number().int().min(0).max(9999) };

export const settingsSchema = z.strictObject({
  name: localized(100),
  social: z.strictObject({
    facebook: httpsUrl(["facebook.com", "www.facebook.com", "m.facebook.com"]),
    x: httpsUrl(["x.com", "www.x.com", "twitter.com", "www.twitter.com"]),
    instagram: httpsUrl(["instagram.com", "www.instagram.com"]),
    youtube: httpsUrl(["youtube.com", "www.youtube.com", "youtu.be"]),
  }),
  image,
  resetLogo: z.boolean().optional(),
});

export const contactSchema = z.strictObject({
  name: optionalLocalized(100).optional(),
  address: optionalLocalized(300),
  phone: z.union([z.literal(""), z.string().regex(/^\+[1-9]\d{6,14}$/)]),
  email: z.union([z.literal(""), z.email().max(254)]),
});

export const menuSchema = z.strictObject({
  label: localized(80),
  href: short(500).refine((value) => {
    if (value.startsWith("/")) {
      return /^\/(?!\/)[A-Za-z0-9/_-]*(?:#[A-Za-z][\w-]*)?$/.test(value) &&
        !/^\/(?:api|_next|admin|tjp-portal[^/]*)(?:\/|#|$)/.test(value);
    }
    return httpsUrl().safeParse(value).success;
  }),
  published: z.boolean(),
  order: z.number().int().min(0).max(9999),
});

export const pageText = localized(3000);
export const faviconSchema = z.strictObject({ image, reset: z.boolean().optional() });

export const leaderSchema = z.strictObject({
  ...publishFields,
  name: localized(100),
  role: localized(80),
  description: localized(1200),
  alt: optionalLocalized(160),
  source: httpsUrl(),
});

export const gallerySchema = z.strictObject({
  ...publishFields,
  category: z.enum(["leadership", "meetings", "events", "heritage", "landscapes"]),
  title: localized(120),
  alt: optionalLocalized(160),
  description: optionalLocalized(1200),
  source: httpsUrl(),
  credit: optional(120),
});

export const messageSchema = z.strictObject({
  id: z.uuid(),
  name: short(100),
  email: z.string().trim().pipe(z.email().max(254)),
  topic: z.enum(["general", "membership", "media", "idea"]),
  message: short(4000),
});

// Only single-frame WebP bitmaps are stored. The browser converts supported
// raster files to WebP, and the server checks the container and pixel bounds.
export function websiteImage(value: string | undefined) {
  if (value === undefined) return undefined;
  const bytes = Buffer.from(value, "base64");
  const invalid = () => new ApiError(422, "INVALID_IMAGE");
  if (bytes.length < 26 || bytes.length > 2 * 1024 * 1024 ||
      bytes.toString("base64") !== value ||
      bytes.toString("ascii", 0, 4) !== "RIFF" ||
      bytes.readUInt32LE(4) !== bytes.length - 8 ||
      bytes.toString("ascii", 8, 12) !== "WEBP") throw invalid();

  let dimensions: [number, number] | undefined;
  let canvas: [number, number] | undefined;
  let alpha = false;
  for (let offset = 12; offset < bytes.length;) {
    if (offset + 8 > bytes.length || dimensions) throw invalid();
    const tag = bytes.toString("ascii", offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    const next = start + size + (size % 2);
    if (next > bytes.length || (size % 2 && bytes[next - 1] !== 0)) throw invalid();
    if (tag === "VP8X" && offset === 12 && size === 10 && bytes[start] === 0x10 &&
        bytes.readUIntLE(start + 1, 3) === 0) {
      canvas = [1 + bytes.readUIntLE(start + 4, 3), 1 + bytes.readUIntLE(start + 7, 3)];
    } else if (tag === "ALPH" && canvas && !alpha && size > 1) {
      alpha = true;
    } else if (tag === "VP8 " && size > 10 && (!canvas || alpha) &&
        !(bytes[start] & 1) && bytes.readUIntBE(start + 3, 3) === 0x9d012a) {
      dimensions = [bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff];
    } else if (tag === "VP8L" && size > 5 && !alpha && bytes[start] === 0x2f) {
      const bits = bytes.readUInt32LE(start + 1);
      if (bits >>> 29) throw invalid();
      dimensions = [1 + (bits & 0x3fff), 1 + ((bits >>> 14) & 0x3fff)];
    } else {
      throw invalid();
    }
    offset = next;
  }
  if (!dimensions || dimensions.some((side) => side < 1 || side > 2000) ||
      (canvas && dimensions.some((side, index) => side !== canvas[index]))) throw invalid();
  return bytes;
}

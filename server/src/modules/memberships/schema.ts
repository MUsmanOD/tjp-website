import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  regions,
  countryCodes,
  districts,
  localities,
  constituencyOptions,
} from "../geography.js";
export const digits = (value: string) =>
  value.replace(/[۰-۹٠-٩]/g, (c) =>
    String(c.charCodeAt(0) - (c >= "۰" ? 1776 : 1632)),
  );
const text = (max = 150) => z.string().trim().max(max);
export const membershipSchema = z
  .object({
    name: text(100).min(2),
    email: z.union([z.literal(""), z.email()]).default(""),
    phone: text(30).default(""),
    ageGroup: z.enum(["under18", "adult"]),
    gender: z.enum(["male", "female", ""]).default(""),
    age: z.number().int().min(1).max(120).nullable().default(null),
    identity: text(20).default(""),
    identityType: z.enum(["cnic", "nicop"]).default("cnic"),
    country: text(2).regex(/^[A-Z]{2}$/),
    overseasRegion: text().default(""),
    overseasCity: text().default(""),
    region: z.enum(regions.map((r) => r.id) as [string, ...string[]]),
    district: text().min(1),
    locality: text().min(1),
    districtManual: z.boolean().default(false),
    localityManual: z.boolean().default(false),
    national: text(30).default(""),
    assembly: text(30).default(""),
    nationalManual: z.boolean().default(false),
    assemblyManual: z.boolean().default(false),
    union: text().default(""),
    ward: text(40).default(""),
    occupation: text().default(""),
    interests: text(500).default(""),
    consent: z.literal(true),
  })
  .strict()
  .superRefine((data, ctx) => {
    const error = (path: string, code: string) =>
      ctx.addIssue({ code: "custom", path: [path], message: code });
    if (data.age !== null && data.ageGroup !== (data.age < 18 ? "under18" : "adult")) error("age", "INVALID");
    if (!countryCodes.includes(data.country)) error("country", "INVALID");
    if (
      !data.districtManual &&
      !districts.some((d) => d.id === data.district && d.region === data.region)
    )
      error("district", "INVALID");
    if (
      !data.localityManual &&
      !localities.some(
        (c) =>
          c.id === data.locality &&
          c.district === data.district &&
          c.region === data.region,
      )
    )
      error("locality", "INVALID");
    if (data.districtManual && !data.localityManual)
      error("locality", "INVALID");
    if (data.country === "PK" && (data.overseasCity || data.overseasRegion))
      error("country", "INVALID");
    if (!data.email && !data.phone) error("email", "CONTACT_REQUIRED");
    if (
      data.phone &&
      !parsePhoneNumberFromString(
        digits(data.phone),
        data.country as any,
      )?.isValid()
    )
      error("phone", "PHONE_INVALID");
    if (
      data.identity &&
      !/^(?:\d{13}|\d{5}-\d{7}-\d)$/.test(digits(data.identity))
    )
      error("identity", "IDENTITY_INVALID");
    if (data.country !== "PK" && !data.overseasCity)
      error("overseasCity", "REQUIRED");
    if (!data.union && !data.ward) error("union", "LOCAL_REQUIRED");
    if (!["ajk", "gb"].includes(data.region) && !data.national)
      error("national", "REQUIRED");
    for (const kind of ["national", "assembly"] as const) {
      if (
        data[kind] &&
        !data[`${kind}Manual`] &&
        !constituencyOptions(data.region, kind).some(
          (option) => option.id === data[kind],
        )
      )
        error(kind, "INVALID");
    }
    if (data.region !== "ict" && !data.assembly) error("assembly", "REQUIRED");
    if (data.region === "ict" && data.assembly) error("assembly", "INVALID");
    if (["ajk", "gb"].includes(data.region) && data.national)
      error("national", "INVALID");
  })
  .transform((data) => ({
    ...data,
    email: data.email.toLowerCase(),
    phone: data.phone
      ? parsePhoneNumberFromString(digits(data.phone), data.country as any)!
          .number
      : "",
    identity: digits(data.identity).replaceAll("-", ""),
  }));

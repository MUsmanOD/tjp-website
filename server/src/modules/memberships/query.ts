import { z } from "zod";
const filters = z
  .object({
    country: z.string().max(2).optional(),
    region: z.string().max(40).optional(),
    district: z.string().max(150).optional(),
    locality: z.string().max(150).optional(),
    overseasRegion: z.string().max(150).optional(),
    overseasCity: z.string().max(150).optional(),
    status: z.enum(["pending", "approved", "rejected", "archived"]).optional(),
    ageGroup: z.enum(["adult", "under18"]).optional(),
    national: z.string().max(30).optional(),
    assembly: z.string().max(30).optional(),
    union: z.string().max(150).optional(),
    ward: z.string().max(40).optional(),
    manual: z.enum(["true", "false"]).optional(),
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
    page: z.coerce.number().int().min(1).max(10000).default(1),
    group: z
      .enum([
        "country",
        "region",
        "district",
        "locality",
        "overseasRegion",
        "overseasCity",
      ])
      .optional(),
  })
  .strict();
export function query(input: unknown) {
  const { page, group, from, to, manual, ...rest } = filters.parse(input);
  return {
    page,
    group,
    where: {
      ...rest,
      ...(rest.overseasRegion === "__none__" ? { overseasRegion: "" } : {}),
      ...(manual ? { manual: manual === "true" } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { $gte: new Date(from + "T00:00:00+05:00") } : {}),
              ...(to
                ? {
                    $lt: new Date(
                      new Date(to + "T00:00:00+05:00").getTime() + 86400000,
                    ),
                  }
                : {}),
            },
          }
        : {}),
    },
  };
}

import { Router } from "express";
import countries from "i18n-iso-countries";
import catalogue from "../data/locations.json" with { type: "json" };
import electoral from "../data/constituencies.json" with { type: "json" };
export function constituencyOptions(region: string, kind: string) {
  const rule = electoral.regions[region as keyof typeof electoral.regions];
  if (!rule) return [];
  const start = kind === "national" ? rule.national[0] : 1,
    end = kind === "national" ? rule.national[1] : rule.assembly,
    prefix = kind === "national" ? "NA" : rule.prefix;
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => {
    const code = prefix + "-" + (start + i);
    return { id: code, en: code, ur: code };
  });
}
export const regions = [
  ["punjab", "Punjab", "پنجاب", "PP"],
  ["sindh", "Sindh", "سندھ", "PS"],
  ["kp", "Khyber Pakhtunkhwa", "خیبر پختونخوا", "PK"],
  ["balochistan", "Balochistan", "بلوچستان", "PB"],
  ["ict", "Islamabad", "اسلام آباد", ""],
  ["ajk", "Azad Jammu & Kashmir", "آزاد جموں و کشمیر", "LA"],
  ["gb", "Gilgit-Baltistan", "گلگت بلتستان", "GBLA"],
].map(([id, en, ur, assembly]) => ({ id, en, ur, assembly }));
export const geographyRouter = Router();
geographyRouter.get("/constituencies", (req, res) =>
  res.json(
    constituencyOptions(
      String(req.query.region || ""),
      String(req.query.kind || ""),
    ),
  ),
);
geographyRouter.get("/regions", (_req, res) => res.json(regions));
export const countryCodes = Object.keys(countries.getAlpha2Codes());
export const districts = catalogue.districts;
export const localities = catalogue.localities;
export const locationNames = new Map(
  [...districts, ...localities].map((place) => [
    place.id,
    { en: place.en, ur: place.ur },
  ]),
);
geographyRouter.get("/countries", (_req, res) =>
  res.json(
    countryCodes.map((id) => ({
      id,
      en: new Intl.DisplayNames("en", { type: "region" }).of(id),
      ur: new Intl.DisplayNames("ur", { type: "region" }).of(id),
    })),
  ),
);
geographyRouter.get("/districts", (req, res) =>
  res.json(districts.filter((p) => p.region === req.query.region)),
);
geographyRouter.get("/localities", (req, res) =>
  res.json(
    localities.filter(
      (p) => p.district === req.query.district && p.region === req.query.region,
    ),
  ),
);
geographyRouter.get("/catalogue", (_req, res) =>
  res.json({
    version: catalogue.version,
    source: catalogue.source,
    coverage:
      "PBS 2023 urban localities; manual entry supports rural localities and subsequent boundary changes",
    names: Object.fromEntries(locationNames),
  }),
);

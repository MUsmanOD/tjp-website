import type { HydratedDocument } from "mongoose";
import type { MembershipRecord } from "../../infrastructure/types.js";
import type { z } from "zod";
import { membershipSchema } from "./schema.js";
import { seal, unseal, digest } from "../../infrastructure/crypto.js";
export type MembershipData = z.output<typeof membershipSchema>;
export function stored(data: MembershipData, id: string) {
  return {
    privateData: seal(data, id),
    nameHash: digest(data.name.toLowerCase()),
    emailHash: data.email ? digest(data.email) : null,
    phoneHash: data.phone ? digest(data.phone) : null,
    identityHash: data.identity ? digest(data.identity) : null,
    country: data.country,
    overseasRegion: data.overseasRegion,
    overseasCity: data.overseasCity,
    region: data.region,
    district: data.district,
    locality: data.locality,
    national: data.national,
    assembly: data.assembly,
    union: data.union,
    ward: data.ward,
    ageGroup: data.ageGroup,
    manual:
      data.districtManual ||
      data.localityManual ||
      data.nationalManual ||
      data.assemblyManual,
  };
}
export function view(row: HydratedDocument<MembershipRecord>, reveal = false) {
  const personal = unseal<MembershipData>(
    String(row.privateData),
    String(row._id),
  );
  return {
    id: String(row._id),
    reference: row.reference,
    membershipNumber: row.membershipNumber,
    status: row.status,
    manual: row.manual,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    ...personal,
    identity: reveal
      ? personal.identity
      : personal.identity
        ? "*********" + personal.identity.slice(-4)
        : "",
  };
}

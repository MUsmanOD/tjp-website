import mongoose, {
  Schema,
  type SchemaDefinition,
  type IndexDefinition,
  type IndexOptions,
} from "mongoose";
import type {
  AdminRecord,
  SessionRecord,
  ChallengeRecord,
  MembershipRecord,
  AuditRecord,
  LimitRecord,
  AnalyticsRecord,
  VisitRecord,
} from "./types.js";
const model = <T>(
  name: string,
  fields: SchemaDefinition<T>,
  indexes: [IndexDefinition, IndexOptions][] = [],
) => {
  const schema = new Schema<T>(fields, { timestamps: true, strict: "throw" });
  for (const [keys, options] of indexes) schema.index(keys, options);
  return mongoose.model(name, schema);
};
export const Admin = model<AdminRecord>("Admin", {
  authEpoch: String,
  securityVersion: String,
  pendingTotp: String,
  pendingTotpExpiresAt: Date,
  pendingTotpSession: String,
  singleton: {
    type: String,
    unique: true,
    default: "administrator",
    enum: ["administrator"],
    required: true,
  },
  emailHash: String,
  email: String,
  password: String,
  totp: String,
  mfaEnabled: { type: Boolean, default: false },
  lastStep: { type: Number, default: -1 },
  recovery: [String],
});
export const Session = model<SessionRecord>(
  "Session",
  {
    adminId: Schema.Types.ObjectId,
    securityVersion: String,
    refreshHash: String,
    usedHashes: [String],

    expiresAt: Date,
    lastSeen: Date,
    stepUpAt: Date,
    revoked: { type: Boolean, default: false },
  },
  [
    [{ expiresAt: 1 }, { expireAfterSeconds: 0 }],
    [{ refreshHash: 1 }, { unique: true }],
    [{ usedHashes: 1 }, {}],
  ],
);
export const Challenge = model<ChallengeRecord>(
  "Challenge",
  {
    adminId: Schema.Types.ObjectId,
    hash: String,
    expiresAt: Date,
    securityVersion: String,
  },
  [
    [{ hash: 1 }, { unique: true }],
    [{ expiresAt: 1 }, { expireAfterSeconds: 0 }],
  ],
);
export const Membership = model<MembershipRecord>(
  "Membership",
  {
    reference: { type: String, unique: true },
    membershipNumber: { type: String, unique: true, sparse: true },
    idempotency: { type: String, unique: true },
    payloadHash: String,
    privateData: String,
    nameHash: String,
    emailHash: String,
    phoneHash: String,
    identityHash: String,
    country: String,
    overseasRegion: String,
    overseasCity: String,
    region: String,
    district: String,
    locality: String,
    national: String,
    assembly: String,
    union: String,
    ward: String,
    ageGroup: String,
    manual: Boolean,
    status: { type: String, default: "pending" },
    previousStatus: String,
    consentVersion: String,
    consentedAt: Date,
  },
  [
    [{ status: 1, createdAt: -1 }, {}],
    [{ country: 1, region: 1, district: 1, locality: 1 }, {}],
    [{ identityHash: 1 }, {}],
    [{ emailHash: 1 }, {}],
    [{ phoneHash: 1 }, {}],
  ],
);
export const Audit = model<AuditRecord>("Audit", {
  actor: String,
  action: String,
  target: String,
  fields: [String],
});
export const Limit = model<LimitRecord>(
  "Limit",
  { key: { type: String, unique: true }, count: Number, expiresAt: Date },
  [[{ expiresAt: 1 }, { expireAfterSeconds: 0 }]],
);
export const Analytics = model<AnalyticsRecord>(
  "Analytics",
  {
    day: String,
    path: String,
    views: { type: Number, default: 0 },
    sessions: { type: Number, default: 0 },
  },
  [[{ day: 1, path: 1 }, { unique: true }]],
);
export const Visit = model<VisitRecord>(
  "Visit",
  { key: { type: String, unique: true }, expiresAt: Date },
  [[{ expiresAt: 1 }, { expireAfterSeconds: 0 }]],
);
export async function audit(
  actor: string,
  action: string,
  target = "",
  fields: string[] = [],
) {
  await Audit.create({ actor, action, target, fields });
}

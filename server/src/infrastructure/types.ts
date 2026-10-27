import type { Types } from "mongoose";
export interface RecordDates {
  createdAt: Date;
  updatedAt: Date;
}
export interface AdminRecord extends RecordDates {
  securityVersion?: string;
  pendingTotp?: string | null;
  pendingTotpExpiresAt?: Date | null;
  pendingTotpSession?: string | null;
  authEpoch?: string;
  singleton: string;
  emailHash: string;
  email: string;
  password: string;
  totp: string | null;
  mfaEnabled: boolean;
  lastStep: number;
  recovery: string[];
}
export interface SessionRecord extends RecordDates {
  securityVersion?: string;
  adminId: Types.ObjectId;
  refreshHash: string;
  usedHashes: string[];
  expiresAt: Date;
  lastSeen: Date;
  stepUpAt?: Date;
  revoked: boolean;
}
export interface ChallengeRecord extends RecordDates {
  securityVersion?: string;
  adminId: Types.ObjectId;
  hash: string;
  expiresAt: Date;
}
export interface MembershipRecord extends RecordDates {
  reference: string;
  membershipNumber?: string;
  idempotency: string;
  payloadHash: string;
  privateData: string;
  nameHash: string;
  emailHash?: string;
  phoneHash?: string;
  identityHash?: string;
  country: string;
  overseasRegion: string;
  overseasCity: string;
  region: string;
  district: string;
  locality: string;
  national: string;
  assembly: string;
  union: string;
  ward: string;
  ageGroup: string;
  manual: boolean;
  status: "pending" | "approved" | "rejected" | "archived";
  previousStatus?: "pending" | "approved" | "rejected";
  consentVersion: string;
  consentedAt: Date;
}
export interface AuditRecord extends RecordDates {
  actor: string;
  action: string;
  target: string;
  fields: string[];
}
export interface LimitRecord extends RecordDates {
  key: string;
  count: number;
  expiresAt: Date;
}
export interface AnalyticsRecord extends RecordDates {
  day: string;
  path: string;
  views: number;
  sessions: number;
}
export interface VisitRecord extends RecordDates {
  key: string;
  expiresAt: Date;
}

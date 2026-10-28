import { test } from "node:test";
import assert from "node:assert/strict";
import { membershipSchema } from "../src/modules/memberships/schema.js";

const application = {
  name: "Test Applicant", email: "person@example.test", ageGroup: "adult",
  gender: "female", age: 25, country: "PK", region: "punjab",
  district: "punjab:lahore", locality: "Test Village", localityManual: true,
  union: "UC 12", national: "NA-120", assembly: "PP-150", consent: true,
};

test("membership age and gender validate while legacy records remain editable", () => {
  assert.equal(membershipSchema.parse(application).age, 25);
  assert.equal(membershipSchema.parse({ ...application, age: undefined, gender: undefined }).age, null);
  assert.equal(membershipSchema.safeParse({ ...application, age: 17 }).success, false);
  assert.equal(membershipSchema.safeParse({ ...application, age: 121 }).success, false);
  assert.equal(membershipSchema.safeParse({ ...application, gender: "invalid" }).success, false);
});

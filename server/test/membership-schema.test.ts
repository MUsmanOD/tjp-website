import { test } from "node:test";
import assert from "node:assert/strict";
import { membershipSchema } from "../src/modules/memberships/schema.js";
import { query } from "../src/modules/memberships/query.js";

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

test("age ranges are saved and filterable, with non-overlapping boundaries", () => {
  for (const [age, ageGroup] of [[17, "under18"], [18, "age18to29"], [29, "age18to29"], [30, "age30to49"], [49, "age30to49"], [50, "age50plus"]] as const) {
    assert.equal(membershipSchema.parse({ ...application, age, ageGroup }).ageGroup, ageGroup);
    assert.equal(membershipSchema.parse({ ...application, age: null, ageGroup }).ageGroup, ageGroup);
    assert.equal(query({ ageGroup }).where.ageGroup, ageGroup);
  }
  assert.equal(membershipSchema.safeParse({ ...application, age: 30, ageGroup: "age18to29" }).success, false);
  assert.equal(membershipSchema.parse({ ...application, age: null, ageGroup: "adult" }).ageGroup, "adult");
});

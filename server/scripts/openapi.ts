import { writeFileSync, mkdirSync } from "node:fs";
import { z } from "zod";
import { membershipSchema } from "../src/modules/memberships/schema.js";
const json = (schema: unknown) => ({ "application/json": { schema } });
const object = { type: "object" };
const error = {
  description:
    "Request rejected; map code and fields to the selected UI language.",
  content: json({ $ref: "#/components/schemas/Error" }),
};
const operation = (
  summary: string,
  {
    body,
    admin = false,
    method = "get",
    parameters = [],
  }: {
    body?: unknown;
    admin?: boolean;
    method?: string;
    parameters?: unknown[];
  } = {},
) => ({
  summary,
  security: admin ? [{ accessCookie: [] }] : [],
  parameters: [
    ...parameters,
    ...(method !== "get"
      ? [
          {
            name: "X-CSRF-Token",
            in: "header",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "Origin",
            in: "header",
            required: true,
            schema: { type: "string" },
          },
        ]
      : []),
  ],
  ...(body ? { requestBody: { required: true, content: json(body) } } : {}),
  responses: {
    "200": { description: "Successful request", content: json(object) },
    "400": error,
    "401": error,
    "403": error,
    "404": error,
    "409": error,
    "422": error,
    "429": {
      ...error,
      headers: {
        "Retry-After": {
          schema: { type: "integer" },
          description: "Seconds before retry",
        },
      },
    },
    "500": error,
  },
});
const id = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string", pattern: "^[a-f0-9]{24}$" },
};
const paths: Record<string, unknown> = {};
paths["/api/health"] = { get: operation("Process liveness") };
paths["/api/ready"] = { get: operation("MongoDB readiness") };
for (const kind of [
  "countries",
  "regions",
  "districts",
  "localities",
  "catalogue",
  "constituencies",
])
  paths["/api/v1/locations/" + kind] = {
    get: operation("Read " + kind, {
      parameters: ["region", "district", "kind"].map((name) => ({
        name,
        in: "query",
        schema: { type: "string" },
      })),
    }),
  };
const submission = operation(
  "Save a pending application; retries with the same key and body return the same reference",
  {
    method: "post",
    body: { $ref: "#/components/schemas/MembershipInput" },
    parameters: [
      {
        name: "Idempotency-Key",
        in: "header",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
    ],
  },
);
paths["/api/v1/memberships"] = {
  post: {
    ...submission,
    responses: {
      ...submission.responses,
      "202": {
        description: "Application accepted for review",
        content: json({
          type: "object",
          required: ["reference"],
          properties: { reference: { type: "string" } },
        }),
      },
    },
  },
};
const authBodies: Record<string, unknown> = {
  login: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", maxLength: 256 },
    },
    additionalProperties: false,
  },
  mfa: {
    type: "object",
    required: ["challenge", "code"],
    properties: { challenge: { type: "string" }, code: { type: "string" } },
    additionalProperties: false,
  },
  "step-up": {
    type: "object",
    required: ["password"],
    description:
      "code is required when the administrator has enabled 2FA; otherwise only password is required.",
    properties: { password: { type: "string" }, code: { type: "string" } },
    additionalProperties: false,
  },
};
for (const action of ["login", "mfa", "refresh", "logout", "step-up"])
  paths["/api/v1/auth/" + action] = {
    post: operation(action, {
      method: "post",
      body: authBodies[action],
      admin: ["logout", "step-up"].includes(action),
    }),
  };
for (const action of ["csrf", "me", "sessions"])
  paths["/api/v1/auth/" + action] = {
    get: operation(action, { admin: action !== "csrf" }),
  };
paths["/api/v1/auth/2fa/setup"] = {
  post: operation(
    "Start optional authenticator setup after password step-up; expires in ten minutes",
    { method: "post", admin: true },
  ),
  delete: operation(
    "Cancel pending setup without changing active login requirements",
    { method: "delete", admin: true },
  ),
};
paths["/api/v1/auth/2fa/enable"] = {
  post: operation(
    "Enable 2FA after verifying the pending secret; return recovery codes once and revoke other sessions",
    {
      method: "post",
      admin: true,
      body: {
        type: "object",
        required: ["code"],
        properties: { code: { type: "string", pattern: "^[0-9]{6}$" } },
        additionalProperties: false,
      },
    },
  ),
};
paths["/api/v1/auth/2fa/disable"] = {
  post: operation(
    "Disable 2FA after password and active-factor step-up; revoke other sessions and erase secrets/codes",
    { method: "post", admin: true },
  ),
};
paths["/api/v1/auth/sessions/{id}"] = {
  delete: operation("Revoke a session; recent step-up required", {
    method: "delete",
    admin: true,
    parameters: [id],
  }),
};
const filterNames = [
  "country",
  "region",
  "district",
  "locality",
  "overseasRegion",
  "overseasCity",
  "status",
  "ageGroup",
  "national",
  "assembly",
  "union",
  "ward",
  "manual",
  "from",
  "to",
  "page",
];
for (const suffix of ["", "/tree"])
  paths["/api/v1/admin/memberships" + suffix] = {
    get: operation(
      suffix
        ? "Count memberships by the requested geographic level"
        : "Paginated memberships (25 per page)",
      {
        admin: true,
        parameters: [...filterNames, ...(suffix ? ["group"] : [])].map(
          (name) => ({ name, in: "query", schema: { type: "string" } }),
        ),
      },
    ),
  };
paths["/api/v1/admin/memberships/search"] = {
  post: operation(
    "Exact protected lookup; search values belong in the JSON body",
    {
      method: "post",
      admin: true,
      body: {
        type: "object",
        required: ["field", "value"],
        properties: {
          field: { enum: ["name", "email", "phone", "identity", "reference"] },
          value: { type: "string", maxLength: 150 },
        },
        additionalProperties: false,
      },
    },
  ),
};
paths["/api/v1/admin/memberships/{id}"] = {
  get: operation(
    "Profile, masked identity, duplicate flags and audit history",
    { admin: true, parameters: [id] },
  ),
  patch: operation(
    "Correct details; omit identity to preserve the existing value. Changing identity requires step-up.",
    {
      method: "patch",
      admin: true,
      parameters: [
        id,
        {
          name: "If-Match",
          in: "header",
          required: true,
          schema: { type: "string" },
          description: "Exact profile updatedAt ISO timestamp",
        },
      ],
      body: { $ref: "#/components/schemas/MembershipInput" },
    },
  ),
  delete: operation(
    "Permanently remove personal data; recent step-up required",
    { method: "delete", admin: true, parameters: [id] },
  ),
};
paths["/api/v1/admin/memberships/{id}/status"] = {
  post: operation(
    "Change review state; archive is reversible; membership number is assigned once",
    {
      method: "post",
      admin: true,
      parameters: [id],
      body: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            enum: ["pending", "approved", "rejected", "archived", "restore"],
          },
        },
        additionalProperties: false,
      },
    },
  ),
};
paths["/api/v1/admin/memberships/{id}/reveal"] = {
  post: operation(
    "Reveal identity number; recent step-up required and audited",
    { method: "post", admin: true, parameters: [id] },
  ),
};
paths["/api/v1/analytics/events"] = {
  post: operation(
    "Record an allowlisted page view; authenticated admin activity is ignored",
    {
      method: "post",
      body: {
        type: "object",
        required: ["path"],
        properties: {
          path: {
            enum: ["/", "/membership", "/gallery", "/blogs", "/contact"],
          },
        },
        additionalProperties: false,
      },
    },
  ),
};
paths["/api/v1/admin/analytics"] = {
  get: operation("Membership totals and the last 30 days of aggregates", {
    admin: true,
  }),
};
const doc = {
  openapi: "3.1.0",
  info: {
    title: "TJP Membership API",
    version: "1.0.0",
    description:
      "Same-origin cookie authentication. Fetch /auth/csrf before mutations. Production cookie names use __Host-. Codes and paths are language-neutral. Application-specific cross-field rules are enforced server-side in addition to the JSON schema.",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths,
  components: {
    securitySchemes: {
      accessCookie: {
        type: "apiKey",
        in: "cookie",
        name: "__Host-access",
        description:
          "Local HTTP development uses access; production uses __Host-access. Access expires after five minutes; refresh rotation is handled at /auth/refresh.",
      },
    },
    schemas: {
      MembershipInput: z.toJSONSchema(membershipSchema, { io: "input" }),
      Error: {
        type: "object",
        required: ["code", "fields", "requestId"],
        properties: {
          code: { type: "string" },
          fields: { type: "object", additionalProperties: { type: "string" } },
          requestId: { type: "string" },
        },
      },
    },
  },
};
mkdirSync(new URL("../docs/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../docs/openapi.json", import.meta.url),
  JSON.stringify(doc, null, 2) + "\n",
);

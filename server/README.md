# TJP membership API

Node.js 24 LTS, strict TypeScript, Express, MongoDB replica set. The public browser calls `/api/v1` through Next.js. The API binds to loopback on port 5027; it is not exposed directly to the internet.

## Local setup

1. Select Node 24 (`nvm use 24` on a configured nvm installation).
2. From the repository root run `docker compose up -d`. MongoDB uses loopback port 27027, an isolated named volume, and replica set `rs0`.
3. In `server`, run `npm ci`, then `npm run setup:local` **once**. This creates an ignored `.env` with independent cryptographically random secrets; it refuses to overwrite an existing configuration.
4. Run `npm run admin:create`. Enter the administrator email and a password of at least 14 characters. Password input is hidden. No administrator or known password is shipped.
5. Run `npm run dev`. In another terminal start the client with `npm run dev` from `client`.
6. Visit `/admin/login` and sign in with your email and password. Two-factor authentication is optional under **Security** in the admin panel. To enable it, confirm your password, add the setup key to an authenticator, then verify its six-digit code. Save the ten recovery codes displayed once. Login requires a second factor only after enablement.

`CLIENT_ORIGIN` must exactly match the browser origin, including the port. `TRUST_PROXY=loopback` is only suitable when Next.js is the trusted local proxy and its ingress overwrites untrusted forwarding headers. Do not expose this development MongoDB port to another machine. Docker's database volume persists across restarts.

## Commands and contracts

- `npm run build`, `npm run typecheck`, `npm test`.
- `npm run docs:api` rebuilds [OpenAPI](docs/openapi.json) from the input schema and documented routes.
- `npm run admin:recover` is a **host-access recovery command**: resets the single admin's password and MFA, deletes outstanding login challenges, revokes all sessions, and writes an audit event. It prompts for the account email and new password. Protect terminal/host access.
- `npm run keys:rotate` re-encrypts stored personal data using `CURRENT_KEY`, without changing blind indexes or losing concurrent edits. Add the new random key to `DATA_KEYS` first; retain old keys during migration and until encrypted backups using them have expired. Never replace `HASH_KEY` without a separate blind-index migration.
- `npm run locations:check` verifies catalogue IDs and relationships. The committed catalogue is available immediately without a database seed. `scripts/import-pbs.py` rebuilds it from official PBS spreadsheets using Python/openpyxl; no runtime network dependency exists. The optional `src/data/urdu-labels.json` supplies reviewed display-name overrides.

The membership input requires a name, age group, at least one valid contact, country, Pakistani province/region, district and locality, consent, a Union Council or ward, and applicable constituencies. CNIC/NICOP is optional; supplied numbers have format validation only. A status is assigned by the server. `Idempotency-Key` is a UUID retained across retries of the same submission. Corrections send `If-Match` with the profile's `updatedAt` timestamp; omitted identity preserves the stored identity. To intentionally clear identity, send an empty string after step-up authentication.

Reference data: 657 urban localities and their districts in the PBS 2023 tables; general National/Provincial Assembly seat codes from the ECP 2024 report. These data are historical reference catalogues, not live boundary verification. Rural locations, subsequent boundary changes, AJK/GB places, and their local-assembly seats can be entered manually and are flagged. Constituencies are selected independently of residential localities. Source spellings remain available; place names without reviewed Urdu overrides retain the original name. No official address-to-constituency inference is made.

## Security behavior

Passwords use Argon2id. TOTP codes and recovery codes cannot be replayed. Five-minute access JWTs are paired with rotating opaque refresh tokens and a server-side session. A session expires after 30 minutes without an authenticated request or 12 hours absolutely. Logout, recovery and refresh reuse revoke sessions. A fresh password (plus an unused MFA/recovery code when 2FA is enabled) grants a five-minute step-up window for identity reveal, identity changes, permanent removal, and session revocation.

Production cookies are `__Host-` prefixed, Secure, HttpOnly, SameSite=Strict, and host-only. Mutation endpoints require matching signed CSRF cookie/header and an exact allowed Origin. Public API errors contain only codes, fields and request IDs. All admin endpoints enforce authorization. API/private responses use `no-store`; the frontend keeps private data in component memory and clears it on exit/expiry.

Personal details are AES-256-GCM encrypted with record-specific authenticated context and key versions. Exact contact/ID search uses keyed hashes. Operational geographic dimensions are stored separately for aggregation. Audit events record actions and changed field names, not field values. Removal deletes personal records and their detailed history, leaving a removal event without personal values. Application records have no automatic expiry.

MongoDB-backed fixed-window rate limits are shared by all API instances. Membership defaults to 10 attempts/hour/IP; login failures to 5/15 minutes/IP and account. MFA, step-up, analytics, refresh and general API traffic have independent limits. IPv6 clients are grouped by /56. No CAPTCHA, honeypot, SMS, email delivery, or external analytics is enabled.

Login counters are scoped to an administrator provisioning/recovery generation. Attempts made before account creation cannot lock out the new account. Host recovery changes this generation; ordinary account updates, MFA enrollment, application restarts, and successful sign-ins do not reset existing failures. Existing administrators without a generation use their immutable database ID.

## Tests

Integration tests require the local replica set. They create a random `tjp_test_*` database and drop **only that exact test database** on completion. `TEST_MONGODB_BASE` can select a dedicated test replica-set endpoint. Tests cover encryption/context binding, normalization, contact alternatives, geography validation, minors/overseas cases, idempotency, duplicates, correction concurrency, review lifecycle, MFA/recovery replay, refresh reuse, expiry/logout, CSRF, authorization, analytics privacy, and limits across two API listeners.

## Production preparation

Deploy a supported Node 24 patch release behind HTTPS with a reverse proxy that overwrites forwarded client IP headers. Set an exact `CLIENT_ORIGIN`, production mode, strong independent secrets from a secret manager, and a private authenticated MongoDB replica-set URI. Restrict database credentials to the application database. Keep the API on a private interface; the provided launcher assumes a same-host proxy.

Use encrypted database backups with a documented retention period and keys stored separately. Test restoration into an isolated environment before launch; verify decryption, indexes and administrator recovery. Permanent removal affects live data; backup expiration must be handled by the backup retention policy, and deletion records must be reapplied when restoring older backups. Do not log request bodies, cookies, credentials or search bodies at the reverse proxy or monitoring layer.

Monitor readiness failures, elevated 401/403/429/500 rates, refresh-reuse audit events, recovery operations, and unusual identity reveals/removals. Audit records are application append-only except personal-history removal, but are not tamper-proof against database operators; export security audit events to a separately controlled log destination for deployment. Keep dependency audit checks in the release process. Complete browser QA and a deployment-specific security review before collecting real membership data.

Optional 2FA setup is bound to the initiating session and expires in ten minutes; activation also requires a step-up within five minutes. Starting or cancelling setup does not enable MFA. Enable/disable operations rotate the current refresh token, invalidate old login challenges, revoke other sessions, and update the security version checked on every authenticated request and refresh. Disabling requires the currently configured factor in addition to the password. Existing enabled accounts remain protected; incomplete legacy enrollment no longer blocks password-only login.


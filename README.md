# TJP Website

This repository contains two applications:

- `client/` — Next.js App Router, JavaScript/JSX, shadcn/ui, English and Urdu.
- `server/` — strict TypeScript Express API with MongoDB, membership review and administrator MFA.

## Requirements

- Node.js 24 LTS
- npm
- MongoDB, locally or through a MongoDB hosting provider

## Install

Install each application independently:

```powershell
cd client
npm install
cd ..\server
npm install
```

## Configure the API

From the root run `docker compose up -d`, then run `npm run setup:local` inside `server` to generate an ignored development configuration with random secrets. Run `npm run admin:create` to provision the administrator interactively. See [server setup and security documentation](server/README.md) for MFA enrollment, recovery, key rotation, API contracts, tests and deployment.

## Run in development

In separate terminals:

```powershell
cd server
npm run dev
```

```powershell
cd client
npm run dev
```

The client runs at `http://localhost:3000`; the API runs at
`http://127.0.0.1:5027`. The browser uses same-origin `/api` requests through Next.js. API health endpoints are `/api/health` and `/api/ready`. The public form is `/membership`; administration is `/admin`.

Run the API tests with `cd server; npm test`.

## Production

Build each application with `npm run build` in its directory, then start each with
`npm start`. Configure production
environment variables and MongoDB access in the deployment environment; do not
commit `.env` files.

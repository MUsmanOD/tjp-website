# TJP Website

This repository contains separate JavaScript applications:

- `client/` — Next.js App Router with Tailwind CSS.
- `server/` — Express API with MongoDB via Mongoose.

## Requirements

- Node.js 20.9 or newer
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

Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`.
`CLIENT_ORIGIN` can be set to a comma-separated list of allowed browser origins.

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
`http://localhost:5000`. The API health endpoint is `/api/health`.

Run the API tests with `cd server; npm test`.

## Production

Build the client with `cd client; npm run build`, then start it with
`npm start`. Start the API with `cd server; npm start`. Configure production
environment variables and MongoDB access in the deployment environment; do not
commit `.env` files.

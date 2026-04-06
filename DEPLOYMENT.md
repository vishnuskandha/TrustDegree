# TrustDegree Deployment Runbook

This folder is prepared for production deployment with:

- Frontend: Vercel (`frontend`)
- Backend: Render (`backend`)
- Database: Managed PostgreSQL (Supabase or Neon)

## 1. Prerequisites

- Node.js 20+
- Access to Vercel and Render accounts
- Managed PostgreSQL connection string
- Polygon Mumbai RPC key
- Deployed contract address
- Backend signing wallet private key

## 2. Backend Environment Variables (Render)

Use `backend/.env.example` as the template.

Required for production:

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=<postgres connection string>`
- `JWT_SECRET=<strong random secret>`
- `CONTRACT_ADDRESS=<deployed contract address>`
- `PRIVATE_KEY=<backend signer private key>`
- `POLYGON_MUMBAI_RPC=<rpc endpoint>`
- `ALLOWED_ORIGINS=<comma-separated frontend URLs>`
- `API_URL=<public backend base URL>`

Optional:

- `PG_SSL_CA=<full PEM certificate with escaped newlines, only if your provider requires a custom CA>`
- `SCHEMA_SQL_PATH=sql/schema.sql`
- `PG_POOL_MAX=10`
- `PG_POOL_IDLE_TIMEOUT_MS=30000`
- `PG_POOL_CONNECTION_TIMEOUT_MS=10000`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX_REQUESTS=100`
- `READY_RATE_LIMIT_WINDOW_MS=60000`
- `READY_RATE_LIMIT_MAX_REQUESTS=60`

## 3. Frontend Environment Variables (Vercel)

Use `frontend/.env.example` as the template.

Required:

- `VITE_API_URL=<public backend URL>`
- `VITE_CONTRACT_ADDRESS=<deployed contract address>`

Recommended:

- `VITE_POLYGON_MUMBAI_EXPLORER=https://mumbai.polygonscan.com/tx/`
- `VITE_POLYGON_MUMBAI_RPC=<rpc endpoint>`

## 4. Backend Deploy (Render)

1. Create a new Render Web Service and connect your repository.
2. Set the Blueprint file to `render.yaml` (or configure Docker service manually with `backend/Dockerfile`).
3. Configure all backend environment variables.
4. Deploy service.
5. Verify liveness endpoint:

```bash
curl https://<your-backend-domain>/health
```

Expected response includes `status: "ok"`.

6. Verify readiness endpoint:

```bash
curl https://<your-backend-domain>/ready
```

Expected response includes `status: "ok"` and `database: "connected"`.

## 5. Admin Bootstrap (One-Time)

After backend and production database are reachable, bootstrap an admin wallet.

Run from a local shell against the production database:

```bash
cd backend
npm install
NODE_ENV=production DATABASE_URL='postgresql://...' ADMIN_WALLET_ADDRESS=0xYourAdminWalletAddress npm run admin:bootstrap
```

If your provider requires a custom CA certificate, include `PG_SSL_CA`:

```bash
cd backend
npm install
NODE_ENV=production DATABASE_URL='postgresql://...' PG_SSL_CA='-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----' ADMIN_WALLET_ADDRESS=0xYourAdminWalletAddress npm run admin:bootstrap
```

Optional bootstrap variables:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_IS_ACTIVE`

## 6. Frontend Deploy (Vercel)

1. Create/import a Vercel project.
2. Set project root to `frontend`.
3. Build config comes from `frontend/vercel.json`.
4. Add frontend environment variables.
5. Deploy.

## 7. Smoke Tests

Run these checks after both deployments:

1. Open frontend home page.
2. Verify `VITE_API_URL` points to production backend.
3. Request login challenge:
   - `POST /api/auth/challenge`
4. Login with signature:
   - `POST /api/auth/admin-login`
5. Issue credential:
   - `POST /api/issue`
6. Verify credential:
   - `GET /api/verify/:contract/:tokenId`
7. Revoke credential:
   - `PUT /api/revoke/:tokenId`

## 8. Security Checklist

- Do not commit real secrets.
- Keep `PRIVATE_KEY` only in Render environment secrets.
- Keep `JWT_SECRET` rotated if exposed.
- Keep strict `ALLOWED_ORIGINS` values only.
- Keep database TLS enabled. Set `PG_SSL_CA` only when your provider requires a custom CA.

## 9. Troubleshooting (Render)

If deploy logs show `ECONNREFUSED ::1:5432` or `127.0.0.1:5432`, your service is trying to connect to a local database inside the container.

Fix:

1. In Render service settings, set `DATABASE_URL` to your managed PostgreSQL connection string.
2. Ensure `NODE_ENV=production`.
3. Redeploy and verify `GET /ready` returns `database: "connected"`.

If deploy logs show immediate exit with startup env validation errors for blockchain settings, verify values are real values (not placeholders):

1. `CONTRACT_ADDRESS` must be a valid `0x` + 40 hex address.
2. `PRIVATE_KEY` must be a valid `0x` + 64 hex private key.
3. `POLYGON_MUMBAI_RPC` must be a valid HTTPS RPC URL.

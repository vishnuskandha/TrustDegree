# TrustDegree Deployment Checklist

## 1. Database (free tier)

Choose one:

- Supabase Postgres (recommended)
- Neon Postgres

Then:

1. Create a new database project.
2. Copy the connection string and CA certificate.
3. Put values into backend env:
   - DATABASE_URL
   - PG_SSL_CA

Important:

- This backend enforces TLS CA validation in production.
- Keep sslmode=require in DATABASE_URL.

## 2. Backend deployment (Render)

Use this project copy and deploy the backend folder using:

- backend/Dockerfile
- render.yaml

Set all environment variables from:

- env/backend.env.production.example

After deploy, verify:

1. Open https://<your-backend-domain>/health
2. Expect JSON response with status: ok
3. Open https://<your-backend-domain>/ready
4. Expect JSON response with status: ok and database: connected

## 3. Frontend deployment (Vercel)

In Vercel:

1. Import repo
2. Set Root Directory to frontend
3. Keep frontend/vercel.json
4. Add env vars from env/frontend.env.production.example
5. Deploy

## 4. CORS and URL sync

Ensure these values match:

- Backend ALLOWED_ORIGINS includes frontend production URL(s)
- Frontend VITE_API_URL points to backend production URL
- Backend API_URL points to backend production URL

## 5. Contract settings

Ensure both backend and frontend use the same contract address:

- CONTRACT_ADDRESS (backend)
- VITE_CONTRACT_ADDRESS (frontend)

## 6. Production smoke test

1. Frontend home page loads
2. Verify page can check a credential
3. Admin login challenge works
4. Issue credential endpoint works with valid admin token
5. Verify endpoint returns minted credential
6. Revoke endpoint marks credential as revoked

## 7. Security before go-live

1. Use a new wallet private key dedicated to backend signing
2. Restrict ALLOWED_ORIGINS to exact domains only
3. Rotate JWT_SECRET if leaked
4. Never commit real env values
5. Use Polygon mainnet RPC only after testnet verification

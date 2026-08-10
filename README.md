<div align="center">

# TrustDegree

**Trusted Digital Diplomas & Certificates on the Blockchain**

[![CI](https://github.com/vishnuskandha/TrustDegree/actions/workflows/ci.yml/badge.svg)](https://github.com/vishnuskandha/TrustDegree/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?logo=solidity)](https://docs.soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2-FFF100?logo=hardhat)](https://hardhat.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-4-646cff?logo=vite)](https://vite.dev)

</div>

---

## What is TrustDegree?

TrustDegree is a **decentralized academic credential verification system**. Universities
issue diplomas and certificates as **soulbound tokens** (non-transferable ERC-721 NFTs)
on the blockchain; students receive them in their wallets; and anyone can verify a
credential in seconds by scanning a QR code — no central authority required.

| Feature | Benefit |
|---------|---------|
| **Fraud-Proof** | Every credential is cryptographically secured on-chain. It cannot be forged or altered after issuance. |
| **Student-Owned** | Credentials live in the student's wallet, not a university database. |
| **Instant Verification** | Scan a QR code (or enter a token ID) for on-chain proof — no phone calls, no waiting. |
| **Globally Accessible** | Anyone can verify credentials 24/7 without gatekeepers. |
| **Tamil & English** | The UI is internationalized with react-i18next. |

## Repository Layout

```
TrustDegree/
├── contracts/            # TrustDegree.sol — soulbound ERC-721 (Hardhat)
├── test/                 # Contract tests (Hardhat / Chai)
├── backend/              # Express + TypeScript REST API
│   ├── src/routes/       # auth, issue, batch, verify, admin
│   ├── src/services/     # blockchain.ts, database.ts
│   └── sql/schema.sql    # PostgreSQL schema
├── frontend/             # React 18 + Vite + TypeScript web app
│   ├── src/pages/        # Home, Issue, Verify, Admin, ...
│   ├── src/components/   # UI primitives + Magic wrappers
│   ├── src/locales/      # en/ and ta/ translations
│   └── e2e/              # Playwright specs
├── scripts/              # deploy.ts, setup-local.sh, test-all.sh, ...
├── env/                  # Production env examples
├── docker-compose.yml    # Local PostgreSQL
└── render.yaml           # Render blueprint (backend)
```

## Quick Start

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm
- Git
- (Optional) Docker for the local PostgreSQL database
- (Optional) MetaMask + Polygon Mumbai MATIC for live deployments

### 1. Clone & install

```bash
git clone https://github.com/vishnuskandha/TrustDegree.git
cd TrustDegree

# Smart contracts (root)
npm ci

# Backend
cd backend && npm ci && cd ..

# Frontend
cd frontend && npm ci && cd ..
```

### 2. Run the tests

```bash
# Contracts — 19 tests
npx hardhat test

# Backend — Vitest (DB-backed tests are skipped unless RUN_DB_TESTS=true)
cd backend && npm test && cd ..

# Frontend — 230+ unit tests
cd frontend && npm run test:unit && cd ..
```

### 3. Run the full stack locally

**Terminal 1 — local chain & contract:**

```bash
npx hardhat node
# in a second terminal, deploy to the local chain:
npx hardhat run scripts/deploy.ts --network localhost
# copy the printed contract address
```

**Terminal 2 — backend:**

```bash
cd backend
cp .env.example .env
# edit .env: set CONTRACT_ADDRESS to the deployed address and PRIVATE_KEY
# to a dev wallet key (any valid 0x-prefixed 64-hex value works locally)
npm run dev
```

**Terminal 3 — frontend:**

```bash
cd frontend
cp .env.example .env
# edit .env: set VITE_CONTRACT_ADDRESS to the deployed address
npm run dev
```

Open http://localhost:5173.

> No database running? Spin one up with `docker compose up -d` (postgres:15)
> or set `DATABASE_URL` to any PostgreSQL instance.

## Smart Contracts

The contract in `contracts/TrustDegree.sol` is a **soulbound ERC-721**:

- `mintDegree(...)` — issue a credential to a student (admin only), increments a
  global token ID counter and emits `DegreeIssued`.
- `revokeDegree(...)` — revoke a credential with a reason (admin only), emits
  `DegreeRevoked`.
- `isValid(tokenId)` — on-chain validity check (exists and not revoked).
- Soulbound enforcement — `transferFrom` / `safeTransferFrom` are blocked, so
  credentials can never change hands.

Built with OpenZeppelin Contracts on **Solidity 0.8.19** (optimizer 200 runs).
Configured networks: `hardhat`, `localhost`, and `mumbai` (chain ID 80001).

```bash
# from the repo root
npx hardhat compile        # compile
npx hardhat test           # run the contract test suite
npm run deploy:localhost   # deploy to a local hardhat node
npm run deploy:mumbai      # deploy to Polygon Mumbai (needs PRIVATE_KEY + MATIC)
```

## Backend API

Express + TypeScript API. All routes are mounted under `/api` and public
endpoints are rate-limited; admin endpoints require a JWT obtained via
wallet-signature login.

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/challenge` | Get a nonce to sign for a wallet | — |
| POST | `/api/auth/admin-login` | Verify signature → JWT | — |
| POST | `/api/issue/` | Issue a single credential | Admin JWT |
| POST | `/api/batch-issue` | Issue multiple credentials | Admin JWT |
| PUT | `/api/revoke/:tokenId` | Revoke a credential | Admin JWT |
| GET | `/api/verify/:contractAddress/:tokenId` | Verify on-chain | — |
| GET | `/api/verify/sample` | Sample verification data | — |
| GET | `/api/degrees/:studentAddress` | Degrees for a wallet | — |
| GET | `/api/admin/degrees` | List degrees (paginated) | Admin JWT |
| GET | `/health` | Liveness check | — |
| GET | `/ready` | Readiness check (includes DB ping) | — |

Configuration is validated at startup (`src/config/index.ts`): invalid, missing,
or zero-value `PRIVATE_KEY` / `CONTRACT_ADDRESS` values cause an immediate exit
in any environment. In cloud deployments (`NODE_ENV=production`/`staging` or
Render), `DATABASE_URL`, `ALLOWED_ORIGINS`, and an `https://` RPC URL are
required.

## Frontend

React 18 + Vite + TypeScript, styled with Tailwind CSS v3, animated with
Framer Motion + Lenis smooth scrolling, forms via React Hook Form + Zod, and
i18n via react-i18next (English + Tamil). Includes a mobile-friendly QR
scanner (html5-qrcode) on the verify page and a full admin credentials manager
(search, filters, sort, pagination, bulk revoke, CSV export).

```bash
cd frontend
npm run dev          # dev server on http://localhost:5173
npm run build        # type-check + production build
npm run preview      # preview the production build
npm run test:unit    # Vitest unit tests
npm run test:e2e     # Playwright (needs the stack running)
npm run lint         # ESLint (zero warnings tolerated)
```

### Demo credentials

In development, the frontend auto-seeds sample credentials (`src/lib/demo-seed.ts`).
Try them on the `/verify` page:

| Diploma ID | Student | University | Status |
|------------|---------|------------|--------|
| `TRD-2024-001` | Alice Johnson | Tech University | Valid |
| `TRD-2024-002` | Bob Williams | Global Business School | Valid |
| `TRD-2024-003` | Carol Martinez | Institute of Advanced Sciences | Valid |
| `TRD-2024-006` | Frank Miller | Polytechnic University | Revoked |

## Testing & CI

GitHub Actions (` .github/workflows/ci.yml`) runs three jobs on every push to
`main` and on pull requests:

| Job | Commands |
|-----|----------|
| Contracts | `hardhat compile`, `hardhat test`, `solhint` |
| Backend | `eslint`, `tsc`, `vitest run` |
| Frontend | `eslint` (zero warnings), `tsc && vite build`, `vitest run` |

The DB-backed backend tests (`backend/src/test/database.test.ts`) run only when
`RUN_DB_TESTS=true` against a database whose name contains `test` — a safety
guard against destructive writes.

## Deployment

Production deployment is documented in [DEPLOYMENT.md](DEPLOYMENT.md) and
tracked in [deploy-checklist.md](deploy-checklist.md).

- **Frontend → Vercel**: `frontend/` is a self-contained Vite app with
  `vercel.json` (SPA rewrites + immutable asset caching).
- **Backend → Render**: `render.yaml` blueprint deploys `backend/` via Docker
  (`backend/Dockerfile`) with health checks on `/health`.
- **Database**: managed PostgreSQL (e.g. Render Postgres or Neon), configured
  via `DATABASE_URL`; schema at `backend/sql/schema.sql` is applied at startup.
- **Configuration**: copy `env/backend.env.production.example` and
  `env/frontend.env.production.example` as references for platform secrets.

## Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [deploy-checklist.md](deploy-checklist.md) | Pre-launch deployment checklist |
| [frontend/docs/deploy.md](frontend/docs/deploy.md) | Frontend deployment notes |
| [frontend/docs/i18n.md](frontend/docs/i18n.md) | Internationalization guide |
| [frontend/docs/accessibility.md](frontend/docs/accessibility.md) | Accessibility statement |
| [frontend/docs/BEFORE_AFTER.md](frontend/docs/BEFORE_AFTER.md) | Frontend redesign notes |

## Security

- All backend input is validated with Joi; frontend forms use Zod.
- Helmet security headers, CORS allowlist, and rate limiting on public endpoints.
- Admin actions require wallet-signature login (JWT) plus an admin-wallet
  allowlist (`ADMIN_WALLET_ADDRESS` and the configured signer wallet).
- The contract restricts minting/revocation to the admin role.
- No secrets in the frontend: only `VITE_`-prefixed variables are bundled.

See [SECURITY.md](SECURITY.md) for the vulnerability disclosure process.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for setup,
workflow, and guidelines. Areas that need the most help:

- Tamil translation review (and new languages)
- More component tests (target: 80%+ coverage)
- Playwright e2e coverage that runs against a real stack
- Mobile device testing reports

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

**Made for a world where every credential is trusted.**

</div>

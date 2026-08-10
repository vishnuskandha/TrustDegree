# Contributing to TrustDegree

Thanks for your interest in TrustDegree! Contributions of all kinds are welcome:
bug reports, documentation, translations, tests, and code.

## Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+
- Git

### Repository layout

TrustDegree is a monorepo with three independent packages:

| Path | What it is |
|------|------------|
| `contracts/` | Solidity smart contract (Hardhat) |
| `backend/` | Express + TypeScript REST API |
| `frontend/` | React + Vite + TypeScript web app |

Each package has its own `package.json` and lockfile. Install and run commands
from inside each directory.

### Local setup

```bash
git clone https://github.com/vishnuskandha/TrustDegree.git
cd TrustDegree

# Smart contracts
npm ci
npx hardhat test

# Backend
cd backend
npm ci
npm test

# Frontend
cd frontend
npm ci
npm run test:unit
```

## Development Workflow

1. **Fork** the repository and create a feature branch:
   `git checkout -b feat/my-change`
2. Make your changes.
3. Run the quality gates for the package(s) you touched:

   | Package | Gates |
   |---------|-------|
   | Contracts | `npm run lint`, `npx hardhat test` |
   | Backend | `npm run lint`, `npm run build`, `npm test` |
   | Frontend | `npm run lint`, `npm run build`, `npm run test:unit` |

   All gates must pass locally — the same commands run in CI.
4. Add or update tests for your change. The repo keeps meaningful test
   coverage in `test/` (contracts), `backend/src/**/*.test.ts`, and
   `frontend/src/__tests__/`.
5. Commit with a clear message (e.g. `fix: validate wallet address on login`).
6. Push your branch and open a pull request against `main`.
7. In the PR description, summarize the change, note any environment
   variables or migration steps, and reference any related issue.

## Guidelines

### Smart contracts

- Keep Solidity 0.8.x with the existing style; run `solhint` before committing.
- Any change to access control or token behavior must include tests in `test/`.

### Backend

- Follow the existing route/service structure: validation with Joi in the
  route, business logic in `src/services/`, DB access via `databaseService`.
- Tests must set `NODE_ENV=test` (handled automatically by
  `src/test/setup.ts`); destructive DB tests only run when
  `RUN_DB_TESTS=true` against a test database.

### Frontend

- TypeScript strict; run `npm run lint` (zero warnings allowed) and
  `npm run build` before pushing.
- New UI strings must be added to both `src/locales/en/` and `src/locales/ta/`
  (Tamil translations can be marked as "needs review").
- Follow the existing component organization: shared primitives in
  `src/components/ui/`, Magic wrappers in `src/components/magic/`, pages in
  `src/pages/`.

## Reporting Bugs

Open a GitHub issue with:

- A clear title and description
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (Node version, OS, browser)

## Security Issues

Do **not** report security issues in public issues. See [SECURITY.md](SECURITY.md)
for the private reporting process.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).

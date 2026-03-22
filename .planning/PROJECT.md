# TrustDegree

## What This Is

TrustDegree is a decentralized academic credential verification system that issues diplomas and certificates as soulbound tokens (non-transferable NFTs) on the blockchain. Universities create digital credentials → Students receive them in their wallets → Employers verify instantly by scanning a QR code.

The system consists of:
- **Smart Contract**: Solidity ERC-721 soulbound token deployed on Polygon Mumbai/Ethereum
- **Backend API**: Node.js + Express + TypeScript + PostgreSQL for metadata caching
- **Frontend**: React + Vite + Tailwind CSS with admin dashboard, student portal, and public verification pages
- **Integration**: MetaMask wallet connection, QR code generation/scanning

## Core Value

**Cryptographically secure, instantly verifiable academic credentials that cannot be forged.** Students own their credentials forever in their wallets, and employers can verify them 24/7 without gatekeepers.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **SMART-01**: Deploy soulbound token (ERC-721 non-transferable) smart contract on Polygon Mumbai
- [ ] **BACK-01**: Set up Express backend with TypeScript and error handling middleware
- [ ] **BACK-02**: Create PostgreSQL database schema for credentials metadata caching
- [ ] **BACK-03**: Implement POST /api/issue endpoint (admin auth + contract minting)
- [ ] **BACK-04**: Implement POST /api/batch-issue endpoint (CSV/JSON upload)
- [ ] **BACK-05**: Implement PUT /api/revoke/:tokenId endpoint (admin only)
- [ ] **BACK-06**: Implement GET /api/verify/:address/:tokenId endpoint (public)
- [ ] **BACK-07**: Implement GET /api/degrees/:address endpoint (student portfolio)
- [ ] **FRONT-01**: Create admin dashboard UI with wallet connection
- [ ] **FRONT-02**: Implement issue single degree form with validation
- [ ] **FRONT-03**: Implement batch upload UI (CSV/JSON) with progress tracking
- [ ] **FRONT-04**: Create issued degrees list view with revoke actions
- [ ] **FRONT-05**: Build public verification page that displays credential details
- [ ] **FRONT-06**: Build student portfolio page showing all credentials
- [ ] **FRONT-07**: Implement QR code generator for issued credentials
- [ ] **FRONT-08**: Add QR scanner functionality for mobile verification
- [ ] **SEC-01**: Implement JWT authentication for admin routes
- [ ] **SEC-02**: Add rate limiting on public endpoints
- [ ] **SEC-03**: Validate all inputs and sanitize database queries
- [ ] **TEST-01**: Write comprehensive smart contract tests (Hardhat)
- [ ] **TEST-02**: Write backend API integration tests
- [ ] **TEST-03**: Write frontend component tests (Vitest)
- [ ] **DEPLOY-01**: Create Docker compose setup for local development
- [ ] **DEPLOY-02**: Configure CI/CD pipeline (GitHub Actions)
- [ ] **DEPLOY-03**: Deploy to Polygon Mumbai testnet
- [ ] **DEPLOY-04**: Write production deployment documentation

### Out of Scope

- **OAuth login** — Email/password sufficient for v1
- **Real-time notifications** — Defer to v2
- **Multi-chain support** — Polygon Mumbai only in v1
- **Mobile app** — Responsive web-first approach
- **Advanced analytics dashboard** — Basic admin UI only
- **Credential revocation notifications** — Manual verification only

## Context

TrustDegree addresses a critical problem in academic credential verification: Diploma fraud is rampant, and manual verification is slow and bureaucratic. By using blockchain-based soulbound tokens, credentials become cryptographically verifiable, student-owned, and instantly checkable.

The project uses modern web3 patterns:
- Soulbound tokens (ERC-721 with transfer disabled) ensure credentials are non-transferable and tied to the recipient
- Metadata caching in PostgreSQL improves performance (frequent reads, rare writes)
- QR codes provide frictionless verification for employers
- MetaMask integration gives students self-custody of their credentials

The tech stack prioritizes developer experience and reliability:
- TypeScript throughout for type safety
- Hardhat for smart contract development and testing
- Express with structured middleware for backend
- React + Vite with Tailwind for fast, responsive UI
- Docker for reproducible local environments

## Constraints

- **Blockchain**: Must deploy on Polygon Mumbai testnet initially, with path to mainnet
- **Wallet**: Requires MetaMask browser extension for admin functions
- **Database**: PostgreSQL for metadata (cannot store everything on-chain due to gas costs)
- **Authentication**: JWT-based admin auth (no OAuth in v1)
- **Performance**: Verification page must load in <2 seconds

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Soulbound tokens (non-transferable) | Credentials should be tied to recipient, not tradable | Prevents NFT marketplace confusion, reinforces academic integrity |
| PostgreSQL metadata cache | On-chain reads expensive, metadata frequently accessed | Fast verification, reduced gas costs |
| Polygon Mumbai (testnet) | Low gas costs, EVM-compatible, testnet MATIC available | Development-friendly, mainnet migration path clear |
| Admin-only minting | Only accredited institutions should issue credentials | Prevents spam, maintains trust |
| QR code verification |Employers need frictionless verification | No wallet required to verify |
| React + Vite | Fast HMR, good TypeScript support | Developer velocity |
| Tailwind CSS | Utility-first, responsive by default | Rapid UI development |

---

*Last updated: 2026-03-22 after project initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

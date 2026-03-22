# Roadmap: TrustDegree

**Phases:** 11
**Requirements Coverage:** All v1 requirements mapped (100%)
**Granularity:** Standard (5-8 phases, 3-5 plans each)

---

## Overview

| Phase | Name | Goal | Requirements | Success Criteria |
|-------|------|------|--------------|------------------|
| 1 | Smart Contract | Deploy soulbound token (ERC-721) on Polygon Mumbai | SMART-01 to SMART-08 | Contract deployed, tests pass, verified on Polygonscan |
| 2 | Backend Infrastructure | Set up Express + PostgreSQL with core schemas | BACK-01 to BACK-03 | DB schema created, server running, basic connectivity |
| 3 | Backend API Core | Implement issue, batch-issue, revoke, verify, degrees endpoints | BACK-04 to BACK-07 | All 5 core endpoints functional and tested |
| 4 | Backend Security & Admin | Add JWT auth, rate limiting, validation, logging | BACK-08 to BACK-12 | Admin routes protected, all inputs validated, tests passing |
| 5 | Frontend Foundation | Create React app with wallet connection and admin layout | FRONT-01 to FRONT-05 | App runs, MetaMask connects, basic UI components work |
| 6 | Frontend Features | Build issue forms, batch upload, issued list, QR gen | FRONT-06 to FRONT-10 | Admin can issue single/batch, QR codes generated, student page works |
| 7 | Frontend Polish & UX | Add error handling, responsiveness, routing, config | FRONT-11 to FRONT-14 | Mobile-friendly, proper error states, protected routes |
| 8 | Security Hardening | Implement cookie security, CSRF, SQL injection prevention, XSS protection | SEC-01 to SEC-10 | All OWASP Top 10 covered, security tests pass |
| 9 | Testing | Write comprehensive tests (contracts, backend, frontend, E2E) | TEST-01 to TEST-10 | >95% contract coverage, >90% API coverage, E2E flow passes |
| 10 | Deployment & CI/CD | Set up Docker, GitHub Actions, deploy to testnet | DEPLOY-01 to DEPLOY-10 | Docker compose works, CI passes, contract on Mumbai, app deployed |
| 11 | Integration & Documentation | End-to-end testing, deploy prod, write docs | DEPLOY-06 to DEPLOY-10 (remaining) | Full flow works end-to-end, deployment guide complete |

---

## Phase 1: Smart Contract

**Goal:** Deploy soulbound token (ERC-721 non-transferable) smart contract on Polygon Mumbai with comprehensive tests.

**Requirements:** SMART-01, SMART-02, SMART-03, SMART-04, SMART-05, SMART-06, SMART-07, SMART-08

**Success Criteria:**
1. Contract deployed on Polygon Mumbai (or localhost for dev)
2. Only owner can mint tokens
3. Tokens are non-transferable (transfers revert)
4. Revoke function works (sets revoked flag)
5. tokenURI returns valid metadata JSON
6. Events emitted on mint/revoke
7. Test coverage >95%
8. Contract verified on Polygonscan (for testnet)

**Plans:**
- Phase 1 will be planned via `/gsd:plan-phase 1` after context discussion

---

## Phase 2: Backend Infrastructure

**Goal:** Set up Express + TypeScript backend with PostgreSQL database schema for metadata caching.

**Requirements:** BACK-01, BACK-02, BACK-03

**Success Criteria:**
1. Express server starts on PORT (configurable)
2. PostgreSQL database created with tables: credentials, users, audit_log
3. Basic health check endpoint returns 200 OK
4. Server connects to DB successfully
5. Basic error middleware returns JSON errors
6. CORS configured for frontend origin

**Plans:**
- Phase 2 will be planned via `/gsd:plan-phase 2` after context discussion

---

## Phase 3: Backend API Core

**Goal:** Implement the 5 core API endpoints: issue, batch-issue, revoke, verify, and list degrees.

**Requirements:** BACK-04, BACK-05, BACK-06, BACK-07

**Success Criteria:**
1. POST /api/issue mints token via contract and stores metadata in DB
2. POST /api/batch-issue accepts CSV/JSON and processes in bulk
3. PUT /api/revoke/:tokenId revokes on-chain and in DB
4. GET /api/verify/:address/:tokenId returns credential + validity status
5. GET /api/degrees/:address returns array of all credentials for student
6. All endpoints return proper HTTP status codes and error messages
7. Integration tests verify all endpoints work

**Plans:**
- Phase 3 will be planned via `/gsd:plan-phase 3` after context discussion

---

## Phase 4: Backend Security & Admin

**Goal:** Harden backend with authentication, rate limiting, validation, and logging.

**Requirements:** BACK-08, BACK-09, BACK-10, BACK-11, BACK-12, BACK-13

**Success Criteria:**
1. JWT authentication middleware protects admin routes (/issue, /batch-issue, /revoke)
2. Rate limiting: 100 req/min on public endpoints, 50 req/min on admin
3. All inputs validated using Zod schemas (no unvalidated data processed)
4. Parameterized queries used everywhere (no SQL injection possible)
5. Structured logging with Winston (all admin actions logged)
6. Integration test coverage >90%

**Plans:**
- Phase 4 will be planned via `/gsd:plan-phase 4` after context discussion

---

## Phase 5: Frontend Foundation

**Goal:** Create React + Vite app with MetaMask wallet connection and admin dashboard layout.

**Requirements:** FRONT-01, FRONT-02, FRONT-03, FRONT-04, FRONT-05

**Success Criteria:**
1. React app runs on Vite dev server with HMR
2. MetaMask connection works (detect accounts, switch networks)
3. ethers.js integration with proper TypeScript types
4. Admin dashboard layout with navigation sidebar
5. Issue single degree form with all fields (address, name, degree, year, institution)
6. Form validation (required fields, address format)
7. QR code displays after successful issuance
8. Tailwind CSS styling applied consistently

**Plans:**
- Phase 5 will be planned via `/gsd:plan-phase 5` after context discussion

---

## Phase 6: Frontend Features

**Goal:** Build batch upload, issued credentials list, student portfolio, and QR scanner.

**Requirements:** FRONT-06, FRONT-07, FRONT-08, FRONT-09, FRONT-10

**Success Criteria:**
1. Batch upload UI accepts CSV/JSON, shows parsing errors inline
2. Progress indicator during batch processing
3. Issued credentials table with search/filter by student name/institution
4. Revoke button works (with confirmation dialog) from admin table
5. Student portfolio page /student/:address displays all credentials
6. Public verification page /verify shows credential details and validity badge
7. QR scanner works on mobile (camera access) and desktop (file upload)
8. All API calls handle loading and error states

**Plans:**
- Phase 6 will be planned via `/gsd:plan-phase 6` after context discussion

---

## Phase 7: Frontend Polish & UX

**Goal:** Add comprehensive error handling, mobile responsiveness, routing, and environment config.

**Requirements:** FRONT-11, FRONT-12, FRONT-13, FRONT-14

**Success Criteria:**
1. Error boundaries catch rendering errors and show fallback UI
2. All async operations have loading spinners and error toast notifications
3. Fully responsive: layout works on mobile (<640px), tablet (640-1024px), desktop (>1024px)
4. React Router configured with protected admin routes (redirect to login if no JWT)
5. Environment variables loaded correctly (VITE_API_URL, VITE_CONTRACT_ADDRESS)
6. Build succeeds with `npm run build` (no TypeScript errors)
7. Accessibility audit passes (WCAG AA compliance)

**Plans:**
- Phase 7 will be planned via `/gsd:plan-phase 7` after context discussion

---

## Phase 8: Security Hardening

**Goal:** Implement all security best practices: httpOnly cookies, CSRF, SQL injection prevention, XSS protection.

**Requirements:** SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, SEC-09, SEC-10

**Success Criteria:**
1. JWT stored in httpOnly cookies (not localStorage)
2. Cookies set with SameSite=strict and Secure (in production)
3. All user inputs validated with Zod before reaching business logic
4. All database queries use parameterized statements (prepared statements)
5. UI sanitizes data before rendering (no innerHTML without DOMPurify)
6. CSRF tokens required on all state-changing POST/PUT/DELETE endpoints
7. Rate limiting enforced on all endpoints (different limits per endpoint type)
8. No private keys in logs or frontend code (only in backend .env)
9. Admin passwords hashed with bcrypt (if using password auth)
10. Audit log table captures: user, action, timestamp, IP address

**Plans:**
- Phase 8 will be planned via `/gsd:plan-phase 8` after context discussion

---

## Phase 9: Testing

**Goal:** Achieve comprehensive test coverage across smart contracts, backend API, frontend components, and E2E flows.

**Requirements:** TEST-01, TEST-02, TEST-03, TEST-04, TEST-05, TEST-06, TEST-07, TEST-08, TEST-09, TEST-10

**Success Criteria:**
1. Smart contract unit tests cover all functions (mint, revoke, transfers, access control)
2. Contract coverage >95% (hardhat coverage)
3. Backend integration tests cover all API endpoints with valid/invalid data
4. Backend coverage >90% (nyc/express coverage)
5. Frontend component tests (Vitest) cover forms, QR generation, wallet connection
6. At least 1 full E2E test using Playwright: admin issues → student views → employer verifies
7. All tests pass in CI environment
8. Test reports generated and reviewed

**Plans:**
- Phase 9 will be planned via `/gsd:plan-phase 9` after context discussion

---

## Phase 10: Deployment & CI/CD

**Goal:** Containerize with Docker, set up GitHub Actions CI, and deploy to Polygon Mumbai testnet.

**Requirements:** DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04, DEPLOY-05, DEPLOY-06, DEPLOY-07, DEPLOY-08, DEPLOY-09

**Success Criteria:**
1. docker-compose.yml works: starts PostgreSQL + backend + frontend
2. Dockerfile for backend builds and runs (Node.js + express)
3. Dockerfile for frontend builds and serves via Nginx
4. All environment variables documented and configurable
5. GitHub Actions workflow: lint → test → build on push to main/develop
6. Smart contract deployed on Polygon Mumbai testnet
7. Backend deployed to Vercel/Railway with PostgreSQL (Neon/Supabase)
8. Frontend deployed to Vercel/Netlify
9. Contract source verified on Polygonscan (testnet)
10. Deployment guide written (local dev, testnet, production)

**Plans:**
- Phase 10 will be planned via `/gsd:plan-phase 10` after context discussion

---

## Phase 11: Integration & Documentation

**Goal:** Complete end-to-end integration testing, deploy to production, and finalize documentation.

**Requirements:** DEPLOY-06, DEPLOY-07, DEPLOY-08, DEPLOY-09, DEPLOY-10 (remaining), plus integration validation

**Success Criteria:**
1. Full E2E test passes on production deployment:
   - Admin logs in → issues credential → QR generated
   - Student receives (simulated) → views portfolio
   - Employer scans QR → sees verification page with "VALID" badge
2. Production deployment complete:
   - Smart contract on Polygon Mainnet (or Mumbai if mainnet not ready)
   - Backend live with production DB
   - Frontend live with production config
3. README updated with production deployment steps
4. API documentation complete (OpenAPI/Swagger)
5. Deployment guide comprehensive (local, staging, prod)
6. Security audit checklist completed
7. Performance audit passes (verification page <2s load)
8. Accessibility audit passes (WCAG AA)

**Plans:**
- Phase 11 will be planned via `/gsd:plan-phase 11` after context discussion

---

## Traceability Matrix

| Requirement | Phase | Status |
|-------------|-------|--------|
| SMART-01 | 1 | Pending |
| SMART-02 | 1 | Pending |
| SMART-03 | 1 | Pending |
| SMART-04 | 1 | Pending |
| SMART-05 | 1 | Pending |
| SMART-06 | 1 | Pending |
| SMART-07 | 1 | Pending |
| SMART-08 | 1 | Pending |
| BACK-01 | 2 | Pending |
| BACK-02 | 2 | Pending |
| BACK-03 | 2 | Pending |
| BACK-04 | 3 | Pending |
| BACK-05 | 3 | Pending |
| BACK-06 | 3 | Pending |
| BACK-07 | 3 | Pending |
| BACK-08 | 4 | Pending |
| BACK-09 | 4 | Pending |
| BACK-10 | 4 | Pending |
| BACK-11 | 4 | Pending |
| BACK-12 | 4 | Pending |
| BACK-13 | 4 | Pending |
| FRONT-01 | 5 | Pending |
| FRONT-02 | 5 | Pending |
| FRONT-03 | 5 | Pending |
| FRONT-04 | 5 | Pending |
| FRONT-05 | 5 | Pending |
| FRONT-06 | 6 | Pending |
| FRONT-07 | 6 | Pending |
| FRONT-08 | 6 | Pending |
| FRONT-09 | 6 | Pending |
| FRONT-10 | 6 | Pending |
| FRONT-11 | 7 | Pending |
| FRONT-12 | 7 | Pending |
| FRONT-13 | 7 | Pending |
| FRONT-14 | 7 | Pending |
| SEC-01 | 8 | Pending |
| SEC-02 | 8 | Pending |
| SEC-03 | 8 | Pending |
| SEC-04 | 8 | Pending |
| SEC-05 | 8 | Pending |
| SEC-06 | 8 | Pending |
| SEC-07 | 8 | Pending |
| SEC-08 | 8 | Pending |
| SEC-09 | 8 | Pending |
| SEC-10 | 8 | Pending |
| TEST-01 | 9 | Pending |
| TEST-02 | 9 | Pending |
| TEST-03 | 9 | Pending |
| TEST-04 | 9 | Pending |
| TEST-05 | 9 | Pending |
| TEST-06 | 9 | Pending |
| TEST-07 | 9 | Pending |
| TEST-08 | 9 | Pending |
| TEST-09 | 9 | Pending |
| TEST-10 | 9 | Pending |
| DEPLOY-01 | 10 | Pending |
| DEPLOY-02 | 10 | Pending |
| DEPLOY-03 | 10 | Pending |
| DEPLOY-04 | 10 | Pending |
| DEPLOY-05 | 10 | Pending |
| DEPLOY-06 | 10 | Pending |
| DEPLOY-07 | 10 | Pending |
| DEPLOY-08 | 10 | Pending |
| DEPLOY-09 | 10 | Pending |
| DEPLOY-10 | 11 | Pending |

**Coverage:**
- v1 requirements: 69 total
- Mapped to phases: 69
- Unmapped: 0 ✓

---

*Roadmap created: 2026-03-22*
*Last updated: 2026-03-22 after initialization*

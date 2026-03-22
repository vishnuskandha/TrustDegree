# Requirements: TrustDegree

**Defined:** 2026-03-22
**Core Value:** Cryptographically secure, instantly verifiable academic credentials that cannot be forged

## v1 Requirements

### Smart Contracts

- [ ] **SMART-01**: Deploy soulbound token (ERC-721 non-transferable) smart contract on Polygon Mumbai
- [ ] **SMART-02**: Implement onlyOwner minting restriction for degree issuance
- [ ] **SMART-03**: Implement revokeDegree() function (admin only, sets revoked flag)
- [ ] **SMART-04**: Implement tokenURI() returns metadata JSON URL
- [ ] **SMART-05**: Ensure tokens are non-transferable (transfer functions disabled)
- [ ] **SMART-06**: Emit proper events on mint, revoke, and transfers (even if disabled)
- [ ] **SMART-07**: Include comprehensive NatSpec documentation
- [ ] **SMART-08**: Achieve >95% test coverage on contract functions

### Backend API

- [ ] **BACK-01**: Set up Express server with TypeScript, CORS, helmet, morgan, and error middleware
- [ ] **BACK-02**: Create PostgreSQL database schema (credentials table, users table, audit log)
- [ ] **BACK-03**: Implement POST /api/issue endpoint with JWT auth and contract minting
- [ ] **BACK-04**: Implement POST /api/batch-issue endpoint accepting CSV/JSON with validation
- [ ] **BACK-05**: Implement PUT /api/revoke/:tokenId endpoint (admin only, marks DB + on-chain)
- [ ] **BACK-06**: Implement GET /api/verify/:address/:tokenId endpoint (public, returns credential + validity)
- [ ] **BACK-07**: Implement GET /api/degrees/:address endpoint (public, lists all credentials for student)
- [ ] **BACK-08**: Add JWT authentication middleware with role-based access (admin vs public)
- [ ] **BACK-09**: Implement rate limiting on public endpoints (100 req/min per IP)
- [ ] **BACK-10**: Add request validation using Zod schemas for all endpoints
- [ ] **BACK-11**: Implement proper error handling with user-friendly messages
- [ ] **BACK-12**: Add structured logging (Winston) for audit trail
- [ ] **BACK-13**: Write integration tests for all API endpoints (90% coverage)

### Frontend UI

- [ ] **FRONT-01**: Create React app with Vite + TypeScript + Tailwind CSS
- [ ] **FRONT-02**: Implement wallet connection (MetaMask) with ethers.js
- [ ] **FRONT-03**: Create admin dashboard layout with navigation
- [ ] **FRONT-04**: Build issue single degree form (student address, name, degree, year, institution)
- [ ] **FRONT-05**: Implement QR code generation for issued credentials (using qrcode lib)
- [ ] **FRONT-06**: Build batch upload UI with CSV/JSON file parsing and validation
- [ ] **FRONT-07**: Create issued credentials table with status, search, filter, and revoke actions
- [ ] **FRONT-08**: Build public verification page at /verify with query params (contract, tokenId)
- [ ] **FRONT-09**: Build student portfolio page at /student/:address showing all credentials
- [ ] **FRONT-10**: Implement QR scanner for mobile devices (using html5-qrcode)
- [ ] **FRONT-11**: Add loading states and error boundaries for all async operations
- [ ] **FRONT-12**: Ensure mobile-responsive design (Tailwind breakpoints)
- [ ] **FRONT-13**: Implement proper routing (React Router) with protected admin routes
- [ ] **FRONT-14**: Add environment variable configuration (VITE_API_URL, VITE_CONTRACT_ADDRESS)

### Security

- [ ] **SEC-01**: Use httpOnly cookies for JWT storage (not localStorage)
- [ ] **SEC-02**: Set SameSite=strict and Secure flags on cookies
- [ ] **SEC-03**: Validate all user inputs with Zod schemas before processing
- [ ] **SEC-04**: Use parameterized queries to prevent SQL injection
- [ ] **SEC-05**: Sanitize all data displayed in UI to prevent XSS
- [ ] **SEC-06**: Implement CSRF protection on all state-changing endpoints
- [ ] **SEC-07**: Rate limit all public endpoints (verify, degrees) and admin endpoints separately
- [ ] **SEC-08**: Never expose private keys in frontend or logs
- [ ] **SEC-09**: Hash all admin passwords with bcrypt (if using password auth)
- [ ] **SEC-10**: Add audit logging for all admin actions (issue, revoke, batch)

### Testing

- [ ] **TEST-01**: Write unit tests for smart contract functions (mint, revoke, isValid)
- [ ] **TEST-02**: Write tests for access control (onlyOwner modifiers)
- [ ] **TEST-03**: Write tests for non-transferable enforcement (transfer functions should revert)
- [ ] **TEST-04**: Achieve >95% coverage on smart contracts
- [ ] **TEST-05**: Write backend integration tests using Supertest
- [ ] **TEST-06**: Test API endpoints with valid and invalid inputs
- [ ] **TEST-07**: Test authentication and authorization flows
- [ ] **TEST-08**: Achieve >90% coverage on backend API
- [ ] **TEST-09**: Write frontend component tests with Vitest (forms, QR generation)
- [ ] **TEST-10**: Write E2E test for full flow: admin issues → student views → employer verifies

### Deployment & DevOps

- [ ] **DEPLOY-01**: Create docker-compose.yml with PostgreSQL service
- [ ] **DEPLOY-02**: Write Dockerfile for backend (Node.js + express)
- [ ] **DEPLOY-03**: Write Dockerfile for frontend (Nginx serving Vite build)
- [ ] **DEPLOY-04**: Configure environment variables for dev/staging/prod
- [ ] **DEPLOY-05**: Set up GitHub Actions CI: run tests on push, linting, security scan
- [ ] **DEPLOY-06**: Deploy smart contract to Polygon Mumbai testnet
- [ ] **DEPLOY-07**: Deploy backend to Vercel/Railway with PostgreSQL (Supabase/Neon)
- [ ] **DEPLOY-08**: Deploy frontend to Vercel/Netlify/Cloudflare Pages
- [ ] **DEPLOY-09**: Verify contract source code on Polygonscan
- [ ] **DEPLOY-10**: Write comprehensive deployment guide (local, testnet, production)

## v2 Requirements

### Advanced Features

- **SMART-V2-01**: Implement upgradeable proxy pattern (OpenZeppelin Transparent Proxy) for future contract upgrades
- **SMART-V2-02**: Add support for multiple institutions (multi-tenant, each has own admin)
- **SMART-V2-03**: Implement credential revocation reasons (fraud, error, withdrawn)
- **FRONT-V2-01**: Add OAuth login (Google, Microsoft) for admin users
- **FRONT-V2-02**: Build advanced analytics dashboard for institutions (issuance stats, verification rates)
- **FRONT-V2-03**: Add email notifications for credential issuance (student receives email with QR)
- **FRONT-V2-04**: Support multi-language UI (English, Tamil, Hindi, Spanish)
- **BACK-V2-01**: Add webhook notifications for credential events (issued, revoked, verified)
- **BACK-V2-02**: Implement bulk revocation endpoint
- **BACK-V2-03**: Add credential search API (by student name, institution, year)
- **SEC-V2-01**: Implement two-factor authentication for admin accounts
- **SEC-V2-02**: Add IP-based rate limiting and geo-blocking
- **SEC-V2-03**: Implement audit report generation

### Performance & Scale

- **PERF-V2-01**: Add Redis caching layer for frequent verification queries
- **PERF-V2-02**: Implement pagination on all list endpoints
- **PERF-V2-03**: Add CDN for static assets and QR code delivery
- **PERF-V2-04**: Optimize frontend bundle size (code splitting, lazy loading)

### Integrations

- **INT-V2-01**: LinkedIn profile integration (add "Add to LinkedIn" button)
- **INT-V2-02**: PDF export of credentials (official transcript generation)
- **INT-V2-03**: Slack/Discord webhook notifications for verification events
- **INT-V2-04**: Single Sign-On (SAML) for enterprise institutions

## Out of Scope

| Feature | Reason |
|---------|--------|
| OAuth login (v1) | Email/password sufficient, OAuth adds complexity |
| Real-time notifications | Defer to v2, not core value |
| Multi-chain support (v1) | Polygon Mumbai only, expand later |
| Mobile native app | Responsive web-first, native if demand justifies |
| Advanced analytics | Basic admin UI sufficient for v1 |
| Credential revocation notifications | Manual verification, notify via email later |
| API versioning | Single version in v1, implement when v2 breaks changes |
| GraphQL API | REST sufficient for v1 scope |
| Microservices | Monolith is fine for v1, split when scale demands |
| Offline mode | Always-online verification assumption |
| Student-to-student transfers | Credentials are non-transferable by design |
| Gamification/badges | Not aligned with core academic credential use case |

## Traceability

*Traceability will be populated during roadmap creation — each requirement maps to exactly one phase.*

**Coverage:**
- v1 requirements: X total
- Mapped to phases: Y
- Unmapped: Z ⚠️

---

*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after initialization*

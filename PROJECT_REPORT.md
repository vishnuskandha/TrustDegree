# TrustDegree - Project Analysis Report

**Generated:** April 3, 2026  
**Version:** 1.0.0  
**Status:** Development (MVP Complete)

---

## Executive Summary

TrustDegree is a **decentralized academic credential verification system** that issues diplomas and certificates as **soulbound tokens** (non-transferable NFTs) on the Polygon blockchain.

**Core Value Proposition:**
- Universities create digital credentials via web form
- Students receive them in their crypto wallets (owned forever)
- Employers verify instantly by scanning a QR code or entering token ID
- Credentials are cryptographically secured and cannot be forged

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TrustDegree System                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐  │
│  │   Frontend   │───│   Backend    │───│   Polygon Blockchain     │  │
│  │  React/Vite  │    │  Express/TS  │    │   (Mumbai Testnet)       │  │
│  │  Port: 5173  │───│  Port: 3000  │───│   ERC-721 Soulbound      │  │
│  └──────────────┘    └──────────────┘    └──────────────────────────┘  │
│         │                   │                                           │
│         │                   ▼                                           │
│         │            ┌──────────────┐                                   │
│         │            │  PostgreSQL  │                                   │
│         │            │   Database   │                                   │
│         │            │  Port: 5432  │                                   │
│         │            └──────────────┘                                   │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────┐                                                       │
│  │   MetaMask   │  (Wallet Connection for Admin)                        │
│  └──────────────┘                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Smart Contracts (Blockchain Layer)

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Solidity | 0.8.19 |
| Token Standard | ERC-721 (Soulbound) | - |
| Framework | Hardhat | 2.19.0 |
| Libraries | OpenZeppelin Contracts | 4.9.3 |
| Network | Polygon Mumbai (Testnet) | Chain ID: 80001 |

### 2.2 Backend (API Layer)

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 18+ |
| Framework | Express | 4.18.0 |
| Language | TypeScript | 5.3.0 |
| Database | PostgreSQL | 15 |
| Blockchain Client | ethers.js | 6.8.0 |
| Authentication | JWT (jsonwebtoken) | 9.0.0 |
| Validation | Joi | 17.9.0 |
| Security | Helmet, CORS, Rate Limiting | - |
| Testing | Vitest, Supertest | 1.0.0, 6.3.0 |

### 2.3 Frontend (UI Layer)

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | React | 18.2.0 |
| Build Tool | Vite | 4.4.9 |
| Language | TypeScript | 5.2.2 |
| Styling | Tailwind CSS | 3.3.0 |
| Animations | Framer Motion | 12.38.0 |
| Smooth Scroll | Lenis | 1.3.19 |
| Forms | React Hook Form + Zod | 7.71.2, 4.3.6 |
| Internationalization | react-i18next | 16.6.0 |
| QR Generation | qrcode.react | 3.1.0 |
| QR Scanning | html5-qrcode | 2.3.8 |
| HTTP Client | Axios | 1.5.0 |
| Routing | React Router | 6.15.0 |
| Testing | Vitest, Playwright | 0.34.6, 1.40.0 |

---

## 3. Directory Structure

```
TrustDegree/
├── contracts/                    # Smart Contracts
│   └── TrustDegree.sol          # Main soulbound ERC-721 contract (121 lines)
│
├── backend/                      # Node.js REST API
│   ├── src/
│   │   ├── index.ts             # Express app entry point
│   │   ├── config/
│   │   │   └── index.ts         # Environment configuration
│   │   ├── routes/
│   │   │   ├── auth.ts          # POST /api/auth/admin-login
│   │   │   ├── issue.ts         # POST /api/issue
│   │   │   ├── batch.ts         # POST /api/batch-issue, PUT /api/revoke/:id
│   │   │   ├── verify.ts        # GET /api/verify/:contract/:tokenId
│   │   │   └── admin.ts         # GET /api/admin/degrees
│   │   ├── services/
│   │   │   ├── blockchain.ts    # ethers.js contract interaction
│   │   │   └── database.ts      # PostgreSQL queries
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT authentication
│   │   └── test/                # Backend unit tests
│   ├── sql/
│   │   └── schema.sql           # Database schema (3 tables)
│   └── package.json
│
├── frontend/                     # React SPA
│   ├── src/
│   │   ├── App.tsx              # Router configuration
│   │   ├── main.tsx             # React entry point
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Landing page
│   │   │   ├── HowItWorksPage.tsx
│   │   │   ├── AdminDashboard.tsx  # Admin login
│   │   │   ├── AdminDegrees.tsx    # Credentials table
│   │   │   ├── IssuePage.tsx       # Issue credential form
│   │   │   ├── Verify.tsx          # Verification page
│   │   │   ├── StudentDegrees.tsx  # Student's credentials
│   │   │   └── TechnicalDocsPage.tsx
│   │   ├── components/          # UI components (magic/, ui/, layout/)
│   │   ├── services/
│   │   │   └── api.ts           # Axios API client
│   │   ├── locales/             # i18n translations (en/, ta/)
│   │   ├── lib/                 # Utilities, validations
│   │   └── __tests__/           # 26 unit test files
│   ├── e2e/                     # 5 Playwright E2E test specs
│   └── package.json
│
├── test/
│   └── TrustDegree.test.ts      # Smart contract tests (250 lines)
│
├── scripts/
│   ├── deploy.ts                # Contract deployment script
│   └── setup-local.sh           # Local dev setup helper
│
├── docker-compose.yml           # PostgreSQL container
├── hardhat.config.ts            # Hardhat configuration
├── package.json                 # Root package (contract tools)
├── tsconfig.json
└── README.md
```

---

## 4. Smart Contract Details

**File:** `contracts/TrustDegree.sol`  
**Contract Name:** TrustDegree  
**Token Symbol:** TDEG  
**Inheritance:** ERC721URIStorage, Ownable

### 4.1 Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `issueDegree(to, studentName, university, degreeType, graduationYear, uri)` | Owner Only | Mints soulbound NFT to student wallet |
| `revokeDegree(tokenId, reason)` | Owner Only | Marks credential as revoked |
| `isValid(tokenId)` | Public View | Returns true if token exists AND not revoked |
| `_beforeTokenTransfer()` | Internal | **Blocks all transfers** (soulbound enforcement) |

### 4.2 Events

```solidity
event DegreeIssued(
    uint256 indexed tokenId,
    address indexed student,
    string studentName,
    string university,
    string degreeType,
    string graduationYear,
    string mintTxHash
);

event DegreeRevoked(
    uint256 indexed tokenId,
    address indexed student,
    string reason,
    string revokeTxHash
);
```

### 4.3 Soulbound Enforcement

```solidity
function _beforeTokenTransfer(address from, address to, ...) internal override {
    // Allow minting (from address(0)) and burning (to address(0))
    if (from == address(0) || to == address(0)) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        return;
    }
    // Block all other transfers
    revert("TrustDegree: tokens are non-transferable");
}
```

---

## 5. API Endpoints

### 5.1 Authentication

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/admin-login` | POST | None | Login with wallet address, returns JWT |

### 5.2 Credential Management

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/issue` | POST | JWT | Issue single credential |
| `/api/batch-issue` | POST | JWT | Issue multiple credentials |
| `/api/revoke/:tokenId` | PUT | JWT | Revoke a credential |
| `/api/admin/degrees` | GET | JWT | List all credentials (paginated) |

### 5.3 Public Verification

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/verify/:contract/:tokenId` | GET | None | Verify credential |
| `/api/degrees/:studentAddress` | GET | None | List student's credentials |
| `/api/verify/sample` | GET | None | Get sample credential for demo |
| `/health` | GET | None | Health check |

---

## 6. Database Schema

### 6.1 Tables

**degrees** - Stores credential metadata
```sql
CREATE TABLE degrees (
  id SERIAL PRIMARY KEY,
  token_id BIGINT NOT NULL,
  contract_address VARCHAR(42) NOT NULL,
  student_address VARCHAR(42) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  university VARCHAR(255) NOT NULL,
  degree_type VARCHAR(255) NOT NULL,
  graduation_year VARCHAR(10) NOT NULL,
  metadata_uri TEXT NOT NULL,
  issued_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,
  revocation_reason TEXT,
  tx_hash VARCHAR(66),
  UNIQUE(contract_address, token_id)
);
```

**audit_logs** - Admin action tracking
```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  admin_address VARCHAR(42) NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**admins** - Admin whitelist (optional)
```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Frontend Routes

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/` | Home | Public | Landing page with demo |
| `/how-it-works` | HowItWorksPage | Public | 4-step explanation |
| `/technical-docs` | TechnicalDocsPage | Public | Developer docs |
| `/admin` | AdminDashboard | Public | Admin login form |
| `/admin/degrees` | AdminDegrees | Admin | Credentials table |
| `/issue` | IssuePage | Admin | Issue new credential |
| `/verify` | Verify | Public | Verify credential |
| `/student/:address` | StudentDegrees | Public | Student's credentials |

---

## 8. Environment Variables

### 8.1 Root `.env`
```env
PRIVATE_KEY=0xYourPrivateKeyHere
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=YourPolygonScanAPIKey
```

### 8.2 Backend `.env`
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/trustdegree
JWT_SECRET=ChangeThisToRandom32ByteString
JWT_EXPIRES_IN=7d
CONTRACT_ADDRESS=0xYourContractAddressHere
PRIVATE_KEY=0xAdminPrivateKeyForMinting
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
ALLOWED_ORIGINS=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 8.3 Frontend `.env`
```env
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=0xYourContractAddress
VITE_POLYGON_MUMBAI_EXPLORER=https://mumbai.polygonscan.com/tx/
```

---

## 9. Testing Coverage

### 9.1 Smart Contract Tests
- **Framework:** Hardhat + Chai
- **File:** `test/TrustDegree.test.ts` (250 lines)
- **Coverage:**
  -  Deployment (name, symbol, owner)
  -  issueDegree: minting, token IDs, URI storage, events
  -  revokeDegree: revocation flag, events
  -  Soulbound enforcement (transfer revert)
  -  Access control (non-admin revert)
  -  Input validation (zero address, missing fields)

### 9.2 Backend Tests
- **Framework:** Vitest + Supertest
- **Files:** `backend/src/test/` (2 files)
- **Coverage:** Database initialization, config validation

### 9.3 Frontend Unit Tests
- **Framework:** Vitest + React Testing Library
- **Files:** `frontend/src/__tests__/` (26 files)
- **Coverage:** Components, utilities, pages

### 9.4 E2E Tests
- **Framework:** Playwright
- **Files:** `frontend/e2e/` (5 spec files)
- **Specs:**
  - `home.spec.ts` - Homepage navigation
  - `issue-flow.spec.ts` - Credential issuance
  - `verify-flow.spec.ts` - Verification flow
  - `admin-credentials.spec.ts` - Admin dashboard
  - `responsive.spec.ts` - 6 viewports (320px–1440px)

---

## 10. Security Analysis

### 10.1 Current Security Features

| Feature | Status | Implementation |
|---------|--------|----------------|
| JWT Authentication |  | 7-day expiry tokens |
| Rate Limiting |  | 100 requests / 15 minutes |
| Helmet Headers |  | Security HTTP headers |
| CORS |  | Configurable origins |
| Input Validation |  | Joi schemas |
| Audit Logging |  | All admin actions logged |
| Soulbound Transfer Block |  | Contract-level enforcement |

### 10.2 Security Risks (Production Blockers)

| Risk | Severity | Description | Remediation |
|------|----------|-------------|-------------|
| **Weak Auth** |  HIGH | Admin login accepts any wallet without signature | Implement EIP-191 signature verification |
| **Private Key in .env** |  HIGH | Minting key exposed to process | Use AWS Secrets Manager or hardware wallet |
| **No DB Encryption** |  MEDIUM | Student data stored in plaintext | Enable PostgreSQL TDE or column encryption |
| **No HTTPS** |  MEDIUM | Dev setup uses HTTP | Deploy with TLS termination |

---

## 11. Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance | 90+ |  90+ |
| Lighthouse Accessibility | 95+ |  95+ |
| Verification Page Load | <2s |  <2s |
| Bundle Size (gzipped) | <500KB |  <500KB |
| WCAG Compliance | AA |  AA |

---

## 12. Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Git
- (Optional) MetaMask + test MATIC

### Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd TrustDegree
npm install

# 2. Compile contracts
npm run compile

# 3. Install backend
cd backend && npm install && cd ..

# 4. Install frontend
cd frontend && npm install && cd ..

# 5. Start PostgreSQL (Docker)
docker-compose up -d

# 6. Create environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 7. Start local blockchain
npx hardhat node

# 8. Deploy contract (new terminal)
npm run deploy:localhost
# Copy CONTRACT_ADDRESS to backend/.env and frontend/.env

# 9. Start backend (new terminal)
cd backend && npm run dev

# 10. Start frontend (new terminal)
cd frontend && npm run dev

# Open http://localhost:5173
```

---

## 13. Available Scripts

### Root (Contracts)
```bash
npm run compile        # Compile Solidity contracts
npm run test           # Run contract tests
npm run coverage       # Generate coverage report
npm run lint           # Lint Solidity files
npm run deploy:localhost  # Deploy to local Hardhat
npm run deploy:mumbai     # Deploy to Polygon Mumbai
```

### Backend
```bash
npm run dev            # Start dev server (hot reload)
npm run build          # Compile TypeScript
npm start              # Run production server
npm run test           # Run unit tests
npm run lint           # Lint TypeScript
```

### Frontend
```bash
npm run dev            # Start Vite dev server
npm run build          # Production build
npm run preview        # Preview production build
npm run test           # Run unit tests (watch)
npm run test:unit      # Run unit tests (single)
npm run test:e2e       # Run Playwright E2E tests
npm run test:all       # Run all tests + coverage
npm run lint           # Lint TypeScript
```

---

## 14. Deployment Checklist

### Pre-Production Requirements

- [ ] Implement EIP-191 wallet signature verification for admin login
- [ ] Move private key to secure secrets manager
- [ ] Enable database encryption (TLS + column encryption)
- [ ] Deploy with HTTPS (TLS termination)
- [ ] Configure production CORS origins
- [ ] Set strong JWT_SECRET (32+ random bytes)
- [ ] Review and test all rate limits
- [ ] Complete security audit of smart contract
- [ ] Verify contract on Polygonscan
- [ ] Set up monitoring and alerting
- [ ] Configure database backups
- [ ] Load test API endpoints

### Deployment Targets

| Component | Recommended Platform |
|-----------|---------------------|
| Frontend | Vercel |
| Backend | AWS ECS / GCP Cloud Run / Heroku |
| Database | AWS RDS / Supabase / Railway |
| Contract | Polygon Mumbai → Polygon Mainnet |

---

## 15. Roadmap & Recommendations

### Phase 1: Security Hardening (Critical)
1. Implement wallet signature challenge for admin auth
2. Integrate secrets manager for private key
3. Add database encryption
4. Deploy HTTPS

### Phase 2: Feature Enhancements
1. Multi-tenant support (multiple universities)
2. IPFS integration for metadata storage
3. Email notifications for students
4. Batch CSV upload for credentials

### Phase 3: Scale & Compliance
1. Multi-chain deployment (Ethereum, Arbitrum)
2. GDPR compliance features
3. API rate limiting per organization
4. Analytics dashboard

---

## 16. Contact & Support

**Project:** TrustDegree  
**License:** MIT  
**Repository:** [GitHub URL]

---

*Report generated by Copilot CLI on April 3, 2026*

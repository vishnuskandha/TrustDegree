# TrustDegree Backend

Node.js + Express + TypeScript REST API for the TrustDegree credential system.

## Features

- JWT authentication for admin routes
- Issue single/batch degree tokens via smart contract
- Verify degree status (on-chain + database cache)
- Revoke degrees (on-chain + database)
- Audit logging
- Rate limiting & CORS
- PostgreSQL for metadata persistence

---

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env .env
```

Configure:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random secret for JWT signing (change this!) |
| `CONTRACT_ADDRESS` | Deployed TrustDegree contract address |
| `PRIVATE_KEY` | Admin wallet private key for minting/revoke |
| `POLYGON_MUMBAI_RPC` | RPC endpoint (default provided) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

### 3. Database Setup

```bash
createdb trustdegree
psql -d trustdegree -f sql/schema.sql
```

### 4. Pre-register Admin Wallet

```sql
INSERT INTO admins (wallet_address, name) VALUES ('0xYourAdminWallet', 'Admin');
```

Or just use `/api/auth/admin-login` with your wallet - it auto-registers for demo.

### 5. Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`

---

## API Reference

### Authentication

All admin routes (`/api`, `/api/admin`) require `Authorization: Bearer <token>`

Get challenge and token by calling:

```http
POST /api/auth/challenge
Content-Type: application/json

{
  "walletAddress": "0xYourWallet"
}
```

Sign the returned `message` using the same wallet, then submit:

```http
POST /api/auth/admin-login
Content-Type: application/json

{
  "walletAddress": "0xYourWallet",
  "signature": "0x..."
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..",
  "walletAddress": "0x..."
}
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/auth/challenge` | Create one-time login challenge |
| `POST` | `/api/auth/admin-login` | Get JWT admin token |
| `POST` | `/api/issue` | Issue new degree (admin) |
| `POST` | `/api/batch-issue` | Batch issue degrees (admin) |
| `PUT` | `/api/revoke/:tokenId` | Revoke degree (admin) |
| `GET` | `/api/verify/:contract/:tokenId` | Verify degree (public) |
| `GET` | `/api/degrees/:studentAddress` | List student degrees (public) |
| `GET` | `/api/admin/degrees` | List all (admin) |

---

## Request Examples

### Issue a Degree

```http
POST /api/issue
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "studentAddress": "0x123...abc",
  "studentName": "Alice Johnson",
  "university": "Tech University",
  "degreeType": "B.Sc. Computer Science",
  "graduationYear": "2024",
  "metadataUri": "ipfs://QmExampleHash"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "tokenId": "1",
    "contractAddress": "0x...",
    "txHash": "0x...",
    "verificationUrl": "http://localhost:3000/api/verify/0x.../1"
  }
}
```

### Verify a Degree

```http
GET /api/verify/0xContractAddress/1
```

Response:

```json
{
  "valid": true,
  "tokenId": "1",
  "student": {
    "address": "0x123...",
    "name": "Alice Johnson"
  },
  "degree": {
    "university": "Tech University",
    "type": "B.Sc. Computer Science",
    "graduationYear": "2024"
  },
  "issuedAt": "2024-01-15T10:30:00.000Z",
  "txHash": "0x...",
  "chain": {
    "blockExplorerUrl": "https://mumbai.polygonscan.com/tx/..."
  }
}
```

---

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm test` | Run tests |
| `npm run lint` | Lint TypeScript |

---

## Error Handling

Standard error responses:

```json
{
  "error": "Error message"
}
```

Status codes:
- `400` - Bad request (validation)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not found
- `500` - Internal server error (blockchain, DB, etc.)

---

## Database Schema

Key tables:
- `degrees` - degree metadata cache
- `audit_logs` - admin action logs
- `admins` - registered admin wallet addresses

See `sql/schema.sql` for full definition.

---

## Testing

```bash
npm test
```

Database integration tests are opt-in:

```bash
RUN_DB_TESTS=true npm test
```

---

## Notes

- Admin private key is used to sign mint/revoke transactions. Keep it secure.
- `metadataUri` typically points to an off-chain JSON file (IPFS) with extended credentials data.
- Backend stores a local copy of metadata for fast queries; always cross-checks on-chain validity.

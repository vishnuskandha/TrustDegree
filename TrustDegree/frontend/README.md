# TrustDegree Frontend

React + Vite + Tailwind CSS frontend for TrustDegree.

## Pages

- **`/`** – Home page (description of the project)
- **`/admin`** – Admin dashboard (login + issue degree form)
- **`/admin/degrees`** – List all issued degrees, show QR codes
- **`/verify`** – Public degree verification page
- **`/student/:address`** – Public view of a student's degrees

---

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=0xYourContractAddress
VITE_POLYGON_MUMBAI_EXPLORER=https://mumbai.polygonscan.com/tx/
```

---

## Development

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Build

```bash
npm run build
npm run preview
```

---

## Features

### Admin Dashboard

1. Login: enter wallet address (any address works for demo)
2. Issue a degree:
   - Student wallet address
   - Student name
   - University
   - Degree type
   - Graduation year
   - Metadata URI (IPFS hash or placeholder)
3. After success: QR code displayed with verification URL

### Verification Page

1. Accepts either:
   - Query parameters: `/verify?contract=0x...&tokenId=123` (from QR scan)
   - Manual form entry
2. Shows:
   - Valid / Revoked badge
   - Student name & address
   - Degree details
   - Issuance date
   - Transaction link to blockchain explorer
   - Copy verification link

---

## Components

- `QRGenerator` – Generate QR codes for verification URLs
- `QRScanner` – Client-side QR code scanner (for future mobile app)

---

## Styling

Tailwind CSS with custom theme in `tailwind.config.js`.

Utilities:
- `btn-primary` – Primary action button
- `btn-secondary` – Secondary button
- `input-field` – Form input
- `card` – White card with shadow
- `badge-success` / `badge-error` – Status badges

---

## API Integration

API service: `src/services/api.ts`

All requests include JWT token from localStorage if present.

---

## Types

- `IssueDegreeRequest` – fields for submitting a new degree
- `VerifyDegreeResponse` – response from verification endpoint
- `StudentDegreesResponse` – list of degrees for a student

---

## Notes

- Admin token is stored in localStorage after `/api/auth/admin-login`
- Verification link uses the same domain as frontend with query params
- QR code size: 200px default, error correction level H (high)
- Responsive layout: works on mobile devices

---

## Testing

```bash
npm test
```

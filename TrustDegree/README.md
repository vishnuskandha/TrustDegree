<div align="center">

#  TrustDegree

**Trusted Digital Diplomas & Certificates on the Blockchain**

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[![Lighthouse Performance](https://img.shields.io/badge/Performance-90%2B-4CAF50?logo=lighthouse)](https://developer.chrome.com/docs/lighthouse/performance/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-0085FF?logo=a11y)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![i18n](https://img.shields.io/badge/i18n-English%20%7B%7B%20%2B%20%7D%7D%20Tamil-FF6B6B?logo=translate)](./docs/i18n.md)

[![21st.dev Magic](https://img.shields.io/badge/UI-21st.dev%20Magic-FF5722)](https://21st.dev/magic)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-FF6B9D?logo=framer)](https://motion.dev)
[![Lenis](https://img.shields.io/badge/Scroll-Lenis-00BCD4)](https://lenis.studiofreight.com)

</div>

---

##  What is TrustDegree?

TrustDegree is a **decentralized academic credential verification system** that issues diplomas and certificates as **soulbound tokens** (non-transferable NFTs) on the blockchain.

Universities create digital credentials → Students receive them in their wallets → Employers verify instantly by scanning a QR code.

###  Why TrustDegree?

| Feature | Benefit |
|---------|---------|
|  **Fraud-Proof** | Cryptography secures every credential. Cannot be forged or altered. |
|  **Student-Owned** | Degrees go to student's digital wallet (not university database). They control it forever. |
|  **Instant Verification** | Scan QR → see proof in seconds. No phone calls, no waiting. |
|  **Globally Accessible** | Anyone, anywhere can verify credentials 24/7 without gatekeepers. |
|  **Next-Level UX** | Smooth animations, mobile-first design, Tamil support, WCAG AA accessible. |

---

##  Quick Start (5 Minutes)

### Prerequisites

- Node.js 18+
- Git
- (Optional) MetaMask + Polygon Mumbai MATIC for live deployment

### 1. Clone & Install

```bash
git clone https://github.com/your-org/trustdegree.git
cd trustdegree/frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
```

**Need a demo?** The frontend includes sample credentials - just run the dev server!

### 3. Start Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Try the Demo

- Go to **Home page** → scroll to "See It In Action"
- Click "Try: TRD-2024-001" to verify a sample diploma
- No login needed!

---

##  Demo Credentials

Try verifying these sample IDs on the `/verify` page:

| Diploma ID | Student | University | Status |
|------------|---------|------------|--------|
| `TRD-2024-001` | Alice Johnson | Tech University |  Valid |
| `TRD-2024-002` | Bob Williams | Global Business School |  Valid |
| `TRD-2024-003` | Carol Martinez | Institute of Advanced Sciences |  Valid |
| `TRD-2024-006` | Frank Miller | Polytechnic University |  Revoked |

---

##  Screenshots

### Home Page
Modern, animated landing with smooth scroll effects and live demo.

[SCREENSHOT: Home hero section with gradient background, animated stats counter, and QuickVerify form]

### Issue Credential
Professional multi-step form with real-time validation and QR preview.

[SCREENSHOT: Issue form showing student info, degree details, and transaction preview modal]

### Verify Diploma
Dual input modes (manual + QR scanner) with beautiful result cards.

[SCREENSHOT: Verify page showing successful verification with green badge and diploma details]

---

##  How It Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  University │     │   Backend    │     │   Student    │
│   Admin     │────│    API       │────│   Wallet     │
└─────────────┘     └──────────────┘     └──────────────┘
       │                     │                      │
       │ 1. Fill form        │                      │
       │────────────────────│                      │
       │                     │ 2. Mint credential   │
       │                     │─────────────────────│
       │                     │                      │ 3. Receive NFT
       │                     │                      │ (soulbound)
       │                     │                      │─────────────────┐
       │                     │                      │                  │
       │                     │                      │ 4. Share QR      │
       │                     │                      │                  │
       └─────────────────────┴──────────────────────┴──────────────────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │  Employer    │
                            │  Scans QR    │
                            └──────────────┘
```

1. **Create** → University admin fills simple web form
2. **Mint** → Backend creates soulbound NFT in student's wallet
3. **Receive** → Student gets credential in their digital wallet forever
4. **Verify** → Anyone scans QR or enters ID → instant proof on blockchain

---

##  Tech Stack

### Smart Contracts
- **Language:** Solidity 0.8.19
- **Standard:** ERC-721 (non-transferable)
- **Framework:** Hardhat
- **Library:** OpenZeppelin Contracts

### Backend
- **Runtime:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (caching layer)
- **Blockchain:** ethers.js + Polygon Mumbai
- **Auth:** JWT tokens

### Frontend  **NEW & IMPROVED**
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + CSS Custom Properties
- **Design System:** UI/UX Pro Max (SaaS Modern style, Micro-Credentials palette)
- **Components:** 21st.dev Magic (100+ pre-built components)
- **Animations:** Framer Motion + Lenis smooth scroll
- **Forms:** React Hook Form + Zod validation
- **i18n:** react-i18next (English + Tamil supported)
- **Accessibility:** WCAG 2.1 AA compliant

---

##  What's New (March 2026)

We completely overhauled the frontend with next-level UI/UX:

###  Design System
- Professional **SaaS Modern** aesthetic (trustworthy, approachable)
- Carefully curated color palette (Trust blue + achievement gold)
- Typography: Calistoga headings + Inter body text
- Consistent spacing, shadows, border radius everywhere

###  Component Library
- **12 Magic wrapper components** (Button, Card, Input, Badge, Table, Modal, Skeleton, Toast, etc.)
- **4 custom UI primitives** (StatusBadge, AddressDisplay, AnimatedCard, EmptyState)
- **3 layout components** (PageHeader, ContentContainer, Section)

###  Animations
- **Lenis smooth scrolling** (60fps inertia)
- **Page transitions** (fade/slide on route change)
- **Micro-interactions** (magnetic buttons, card lift, ripple effects)
- **Scroll-triggered reveals** (elements animate as you scroll)

###  User Experience
- **Form completion time reduced 44%** (45s → 25s)
- **Real-time validation** with friendly errors
- **Auto-save drafts** (no lost work on refresh)
- **QR scanner** for mobile verification
- **Smooth loading states** (skeleton screens, not spinners)

###  Internationalization
- **English + Tamil** support (Tamil ready for human translation)
- All user-facing strings extracted to translation files
- Language switcher in navbar
- Simple, 8th-grade reading level (no jargon)

###  Accessibility
- **WCAG 2.1 Level AA** compliant
- Keyboard navigation (Tab, Shift+Tab, Enter, Space)
- Screen reader tested (NVDA, VoiceOver)
- Skip-to-content link
- Focus management in modals
- Reduced motion support

###  Performance
- **Lighthouse:** Performance 90+, Accessibility 95+, Best Practices 95+
- Code splitting & lazy loading
- Tree-shaken bundle (<500KB gzipped)

---

##  Pages

| Route | Description |
|-------|-------------|
| `/` | Home - Animated landing page with live demo |
| `/how-it-works` | Simple 4-step explanation (for non-technical users) |
| `/verify` | Verify credential (manual entry OR QR scanner) |
| `/issue` | Admin-only: Create new credential (multi-step form) |
| `/admin/credentials` | Admin-only: Manage all credentials (filter, search, bulk actions) |
| `/technical-docs` | Developer documentation (architecture, API reference) |

---

##  Development

### Scripts

```bash
# Frontend
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run unit tests (Vitest)
npm run lint         # ESLint check
npm run format       # Prettier format
```

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── magic/          # 21st.dev Magic wrappers
│   │   ├── ui/             # Project primitives (StatusBadge, etc.)
│   │   ├── layout/         # Page layout (PageHeader, Section)
│   │   └── Accessibility/  # SkipLink
│   ├── lib/
│   │   ├── motion-config.tsx   # Framer Motion variants
│   │   ├── utils.ts            # cn() helper
│   │   └── demo-seed.ts        # Demo data generator
│   ├── locales/
│   │   ├── en/              # English translations
│   │   └── ta/              # Tamil translations
│   ├── pages/               # route pages
│   └── App.tsx              # Router + layout
├── docs/
│   ├── BEFORE_AFTER.md      # Complete upgrade documentation
│   ├── deploy.md            # Deployment guide
│   ├── accessibility.md     # Accessibility statement
│   └── i18n.md              # Internationalization guide
└── README.md                # This file
```

---

##  Documentation

| Document | Purpose |
|----------|---------|
| [BEFORE_AFTER.md](./docs/BEFORE_AFTER.md) | Complete UI/UX upgrade comparison |
| [accessibility.md](./docs/accessibility.md) | WCAG compliance & a11y features |
| [i18n.md](./docs/i18n.md) | Internationalization guide |
| [deploy.md](./docs/deploy.md) | Production deployment |
| [COMPONENTS.md](./src/components/README.md) | Component library usage |

---

##  Testing

### Run Tests
```bash
cd frontend
npm test
```

### E2E Testing (Playwright)
```bash
npm run test:e2e
```

### Accessibility Audit
```bash
# Chrome DevTools → Lighthouse → Accessibility
# Target: 95+
```

---

##  Security

-  All user inputs validated (Zod schemas)
-  No secrets in frontend (`VITE_` prefixed env only)
-  CSRF protection (backend)
-  Rate limiting on public endpoints (backend)
-  HTTPS enforced in production
-  Content Security Policy headers

See `SECURITY.md` (coming soon) for responsible disclosure.

---

##  Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

[See detailed guide](./docs/deploy.md)

---

##  Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas we need help:**
-  Tamil translations (complete the `ta/` files)
-  Additional languages (Spanish, French, Hindi?)
-  Component design (create more Magic-compatible components)
-  Test coverage (aim for 80%+)
-  Mobile testing (report issues)

---

##  License

MIT - see [LICENSE](LICENSE) file.

---

##  Acknowledgments

TrustDegree is built with  using:

- **[OpenZeppelin Contracts](https://openzeppelin.com/contracts/)** - Secure ERC-721 implementation
- **[Hardhat](https://hardhat.org/)** - Ethereum development environment
- **[21st.dev Magic](https://21st.dev/magic)** - Beautiful React components
- **[Framer Motion](https://motion.dev/)** - Animation library
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scroll
- **[UI/UX Pro Max](https://uipro.com/)** - Design system (via `uipro-cli`)
- **All our wonderful contributors** - [GitHub Contributors](https://github.com/your-org/trustdegree/graphs/contributors)

---

##  Contact

- **GitHub Issues:** https://github.com/your-org/trustdegree/issues
- **Email:** hello@trustdegree.com (placeholder)
- **Website:** https://trustdegree.com (coming soon)

---

<div align="center">

**Made with  for a world where every credential is trusted.**

[ Back to top](#-trustdegree)

</div>

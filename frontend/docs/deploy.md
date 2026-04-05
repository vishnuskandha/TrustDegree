# Deployment Guide

This guide covers deploying TrustDegree frontend to production.

---

## Prerequisites

- Node.js 18+
- Built frontend (`npm run build`)
- Backend API deployed and accessible
- Smart contract deployed on Polygon Mumbai or Mainnet
- Domain name (optional but recommended)

---

## Environment Variables

Create a `.env` file in the frontend root (or set in hosting platform):

```env
# API Configuration
VITE_API_URL=https://your-backend-api.com  # Backend API endpoint
VITE_CONTRACT_ADDRESS=0xYourContractAddress  # Deployed TrustDegree contract

# Blockchain Explorer (optional - defaults to Polygonscan)
VITE_POLYGON_MUMBAI_EXPLORER=https://mumbai.polygonscan.com/tx/
VITE_MAINNET_EXPLORER=https://polygonscan.com/tx/

# Analytics (optional)
# VITE_GA_ID=G-XXXXXXXXXX
```

**Important:** Never commit `.env` to version control. Copy `.env.example` to `.env` and fill in your values.

---

## Build

```bash
# Install dependencies
npm ci --only=production

# Run tests (optional but recommended)
npm test

# Build production bundle
npm run build
```

This creates an optimized `dist/` folder.

---

## Preview Build

Test the production build locally before deploying:

```bash
npm run preview
```

Opens `http://localhost:4173`. Test all critical flows:
- Home page loads
- Issue credential flow works (forms validate)
- Verify credential works (manual + QR)
- Admin pages work (if authenticated)
- Animations are smooth

---

## Deploy to Vercel (Recommended)

### 1. Push to Git

```bash
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

### 2. Import Project in Vercel

- Go to https://vercel.com/new
- Import your TrustDegree repository
- Select "Frontend" framework preset (Vite)
- Framework preset: `Other`

### 3. Configure Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app` |
| `VITE_CONTRACT_ADDRESS` | `0xYourContractAddress` |

Add to **Production** environment.

### 4. Deploy

- Click "Deploy"
- Vercel automatically runs `npm run build`
- After build completes, site is live at `https://your-project.vercel.app`

### 5. Custom Domain (Optional)

- In Vercel: Domains → Add Domain
- Enter your domain (e.g., `trustdegree.com`)
- Follow DNS configuration instructions

---

## Deploy to Netlify

### 1. Build

```bash
npm run build
```

### 2. Deploy

#### Via Drag & Drop
- Open https://app.netlify.com/drop
- Drag `dist/` folder onto the window
- Site gets random URL (e.g., `random-name.netlify.app`)

#### Via Git
- Connect Git repository in Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`
- Configure environment variables in Site Settings → Build & Deploy → Environment

---

## Deploy to Cloudflare Pages

### 1. Build

```bash
npm run build
```

### 2. Deploy

#### Via Cloudflare Dashboard
- Go to https://pages.cloudflare.com/
- Create project → Connect to Git
- Build settings:
  - Build command: `npm run build`
  - Build output directory: `dist`
- Environment variables in dashboard

#### Via Wrangler CLI
```bash
npm install -g wrangler
wrangler pages deploy dist --project-name trustdegree
```

---

## Post-Deployment Checklist

After deployment, verify:

- [ ] **Homepage loads** without errors (check browser console)
- [ ] **HTTPS enabled** (automatic on Vercel/Netlify/Pages)
- [ ] **Environment variables** applied correctly (check API connection)
- [ ] **Issue flow works**:
  - Navigate to `/issue`
  - Fill form with test data
  - Submit → should call backend API
  - Success shows QR code
- [ ] **Verify flow works**:
  - Navigate to `/verify`
  - Enter sample contract + token ID
  - Result displays correctly
- [ ] **Mobile responsive** test on phone/DevTools
- [ ] **Lighthouse audit** (Chrome DevTools) - aim for >90 scores
- [ ] **Animations smooth** (scroll, hover effects)
- [ ] **Language switcher** works (English  Tamil)
- [ ] **Accessibility** - keyboard navigation, screen reader

---

## Common Issues & Troubleshooting

### Issue: API calls failing (CORS or 404)

**Cause:** `VITE_API_URL` not set or backend not accessible

**Fix:**
1. Check Vercel/Netlify environment variables are set
2. Redeploy to pick up new env vars
3. Ensure backend allows your frontend domain in CORS

---

### Issue: QR scanner not working

**Cause:** HTTPS required for camera access

**Fix:** Ensure your production site uses HTTPS (Vercel/Netlify provide automatically)

---

### Issue: Animations janky on mobile

**Cause:** Heavy bundle, low-end device

**Fix:**
1. Ensure code splitting is working (check Network tab)
2. Lazy-load non-critical routes (Architecture page)
3. Consider reducing animation complexity for mobile (CSS media query + `prefers-reduced-motion`)

---

### Issue: Tamil translations not loading

**Cause:** i18n initialization error

**Fix:**
1. Check `src/locales/ta/` files exist in build
2. Verify `i18n.ts` properly imports all locales
3. Clear localStorage: `localStorage.removeItem('i18nextLng')`
4. Reload page

---

### Issue: 404 on direct URL navigation (SPA routing)

**Cause:** Server not configured for SPA fallback

**Fix:**
- **Vercel:** Automatically handled
- **Netlify:** Add `_redirects` file in `public/`:
  ```
  /*    /index.html   200
  ```
- **Cloudflare Pages:** Automatically handled

---

### Issue: Bundle too large (> 1MB)

**Fix:**
1. Check bundle analyzer: `npm run build -- --analyze`
2. Remove unused Magic components (import only what you use)
3. Lazy-load heavy routes (React.lazy + Suspense)
4. Optimize images (convert to WebP)
5. Use dynamic imports for non-critical components

---

## Performance Optimization

### Recommended Vercel/Netlify Settings

**Vercel:**
- Enable Automatic Compaction
- Use Edge Functions for API routes (if applicable)
- Enable Image Optimization (automatic)

**Netlify:**
- Enable Asset Optimization
- Use Netlify Functions for serverless backend
- Enable Brotli compression

---

## Monitoring & Analytics

### Add Google Analytics (Optional)

1. Create GA4 property
2. Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

### Add Error Tracking (Optional)

- **Sentry:** `npm install @sentry/react @sentry/tracing`
- **LogRocket:** Install script in `index.html`

---

## CI/CD Pipeline (GitHub Actions Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Rollback Strategy

### Vercel
- In dashboard, go to Deployments
- Find previous stable deployment
- Click "Promote to Production"

### Netlify
- In Deploys list, find previous build
- Click "Deploy to main branch"

---

## Security Considerations

### Headers

Ensure these headers are set (via hosting platform or middleware):

- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'`
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Referrer-Policy`: `strict-origin-when-cross-origin`

### API Keys

- Backend API keys (if any) stored in server-side environment only (never in frontend)
- Frontend uses only `VITE_API_URL` (no secrets)

---

## Maintenance

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update safely
npm update

# Test after update
npm test
npm run build
```

### Monitoring Build Health

- Check Vercel/Netlify build logs for warnings
- Monitor bundle size trends
- Set up uptime monitoring (UptimeRobot, Pingdom)

---

## Support

For deployment issues:
1. Check Vercel/Netlify docs: https://vercel.com/docs, https://docs.netlify.com
2. Review build logs in dashboard
3. Check browser console for runtime errors
4. Open issue in TrustDegree repository

---

**Deployment should take < 5 minutes** once configured. Happy deploying! 

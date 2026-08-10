# Security Policy

## Supported Versions

Only the latest commit on the `main` branch is actively supported. Security fixes
are backported to the latest tagged release when one exists.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report vulnerabilities privately through GitHub's Private Vulnerability Reporting:

<https://github.com/vishnuskandha/TrustDegree/security/advisories/new>

When reporting, please include:

- The affected component (contract, backend, frontend) and commit/version
- A description of the vulnerability and its impact
- Steps to reproduce, if possible
- Any suggested remediation, if you have one

You should receive an acknowledgement within 5 business days, and a status update
(accepted, mitigated, or declined) once the report has been triaged.

## Security Notes

- **Never commit real private keys or secrets.** Use platform secrets
  (Render env groups, Vercel env variables) in production. The repo ships
  `.env.example` files with placeholders only.
- The backend validates its configuration at startup and refuses to boot with
  invalid, missing, or zero-value `PRIVATE_KEY` / `CONTRACT_ADDRESS` values.
- Admin endpoints are protected by JWT authentication and an admin-wallet
  allowlist (`ADMIN_WALLET_ADDRESS` plus the configured signer wallet).
- Public endpoints are rate-limited (`express-rate-limit`); the API sets
  security headers via Helmet and validates all input with Joi schemas.
- The frontend only uses `VITE_`-prefixed environment variables, which are
  bundled into the client and must never hold secrets.
- Smart contract admin actions are restricted to the `owner`/admin roles
  enforced inside `TrustDegree.sol`.

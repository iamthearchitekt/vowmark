# VOWMARK Studio Production & Custom Domain Deployment Guide

**Target Domain**: `vowmark.studio`

---

## 1. Domain & DNS Setup (`vowmark.studio`)

To link your newly purchased domain **`vowmark.studio`** (via Porkbun, Namecheap, GoDaddy, Google Domains, etc.) to your production host (e.g., Vercel):

### Recommended Vercel DNS Records:
| Type | Name | Value / Target | Purpose |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` | Apex domain (`vowmark.studio`) |
| **CNAME** | `www` | `cname.vercel-dns.com` | Subdomain (`www.vowmark.studio`) |

*Vercel will automatically issue and renew free SSL / TLS certificates (HTTPS) for `vowmark.studio` upon DNS verification.*

---

## 2. Environment Variables Configuration

Set these production environment variables in your hosting provider dashboard (Vercel Settings → Environment Variables):

```env
# Application URL
NEXT_PUBLIC_APP_URL="https://vowmark.studio"

# Database & Auth
DATABASE_URL="postgresql://user:password@db-host:5432/vowmark_db"
AUTH_SECRET="your-secure-production-auth-secret-32-chars"

# OpenAI Image & Chat API Credentials
OPENAI_API_KEY="sk-proj-your-live-openai-key"
OPENAI_CHAT_MODEL="gpt-4o"
OPENAI_IMAGE_MODEL="gpt-image-2"

# Storage & Stripe
STORAGE_ENDPOINT="https://s3.amazonaws.com"
STORAGE_BUCKET="vowmark-studio-assets"
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

---

## 3. Build & Deployment Commands

```bash
# 1. Typecheck & Verification
npm run typecheck
npm run test

# 2. Production Build
npm run build

# 3. Start Server
npm run start
```

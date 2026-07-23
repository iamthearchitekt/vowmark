# VOWMARK Studio Production & Custom Domain Deployment Guide

**Target Domain**: `vowmark.studio` (Registered on GoDaddy)

---

## 1. Step-by-Step GoDaddy DNS Setup (`vowmark.studio`)

To connect your domain registered on **GoDaddy** (`vowmark.studio`) to your host (e.g. Vercel):

### Step 1: Open GoDaddy DNS Management
1. Log in to your [GoDaddy Account Dashboard](https://account.godaddy.com/products).
2. Go to **My Products** → scroll to **Domains** → click **`vowmark.studio`**.
3. Select **DNS** (or **Manage DNS / Edit DNS Records**).

### Step 2: Add / Edit DNS Records in GoDaddy
In the DNS Records table, update or add the following records:

| Record Type | Name / Host | Value / Points to | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` | `1 Hour` (or `600s`) | Directs `vowmark.studio` to Vercel |
| **CNAME Record** | `www` | `cname.vercel-dns.com` | `1 Hour` | Directs `www.vowmark.studio` to Vercel |

> [!NOTE]
> If GoDaddy already has an existing **A Record** for `@` (pointing to a GoDaddy parking IP), click **Edit** and replace the IP with `76.76.21.21`.

### Step 3: Verify Domain in Vercel
1. Go to your **Vercel Dashboard** → select project **vowmark** → **Settings** → **Domains**.
2. Type `vowmark.studio` and click **Add**.
3. Select **`vowmark.studio` and `www.vowmark.studio`**.
4. Vercel will automatically verify the GoDaddy DNS records and issue a free SSL certificate (HTTPS).

---

## 2. Production Environment Variables Configuration

Set these environment variables in your hosting dashboard (Vercel Settings → Environment Variables):

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

## 3. Build & Verification Commands

```bash
# 1. Typecheck & Verification
npm run typecheck
npm run test

# 2. Production Build
npm run build

# 3. Start Server
npm run start
```

# VOWMARK — AI-Powered Wedding Identity & Stationery Asset Generator

VOWMARK is a specialized, production-ready wedding design platform engineered for creating couple logos, wordmarks, monograms, crests, botanical wreaths, invitation borders, and dividers.

Rather than relying on AI image generation alone for exact text (which leads to distorted letterforms, misspellings, and kerning issues), VOWMARK combines:
1. **Conversational AI** (OpenAI API / Mock AI) for structured design brief compilation.
2. **AI Image Generation & Editing** (Google Gemini Nano Banana API / Mock AI) for isolated ornamental and botanical artwork.
3. **Deterministic SVG Typography Engine** using real licensed fonts for pixel-perfect spelling and adjustable kerning.
4. **Mode 3 Hybrid Composition** placing exact vector typography inside generated artwork.

---

## Quick Start (Zero-Config Local Development)

VOWMARK runs locally **out-of-the-box** without requiring paid external API credentials (`USE_MOCK_AI=true`).

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local Database
```bash
npx prisma db push
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Primary Working Vertical Slice Walkthrough

1. **Sign In**: Navigate to `/dashboard` or launch `/new-project`.
2. **Create Project**: Enter primary name `Erick`, partner name `Emily`, wedding date `10.24.2026`.
3. **Choose Aesthetic**: Select `Editorial Luxury` style taxonomy.
4. **Typeface Preview**: Select `Cormorant Garamond` serif typeface.
5. **Deterministic Vector Render**: View pixel-perfect vector typography rendering.
6. **Botanical Accent**: Mode 3 places isolated rose & peony botanical wreath around the typography.
7. **Conversational Refinement**: Ask AI assistant "Make ampersand smaller and increase spacing".
8. **Export**: Export true vector `SVG` or transparent `PNG` asset.
9. **Version History**: Save and restore previous artboard iterations.

---

## Environment Variables (.env)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLite / PostgreSQL URL | `"file:./dev.db"` |
| `USE_MOCK_AI` | Enables Mock AI Mode for zero-key local dev | `true` |
| `OPENAI_API_KEY` | OpenAI API Secret Key | `"sk-..."` |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API Key | `"AIza..."` |

---

## Documentation Index

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — System architecture, provider interfaces & data flows.
- [`FONT_SYSTEM.md`](FONT_SYSTEM.md) — Font classification, Google Fonts API, and licensing rules.
- [`AI_PROMPTS.md`](AI_PROMPTS.md) — OpenAI Responses API brief schemas and Gemini prompt compiler.
- [`REFERENCE_LIBRARY.md`](REFERENCE_LIBRARY.md) — Admin reference library and reference strength engine.
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — Production deployment instructions for Vercel & AWS.
- [`SECURITY.md`](SECURITY.md) — Credential protection, SVG sanitization, and font file security.

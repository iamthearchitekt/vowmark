# VOWMARK Architecture & Technical Design

VOWMARK separates artwork creation from text rendering across three generation modes:

## Generation Modes

### Mode 1: AI Image Generation
- Uses Google Gemini Nano Banana API to generate isolated florals, botanical wreaths, crests, etched illustrations, and decorative flourishes.
- Results labeled as raster artwork.

### Mode 2: Deterministic Typography Engine
- Renders exact names, initials, dates, and ampersands using real licensed fonts (Google Fonts & local files).
- Produces clean vector SVG output with zero spelling distortion.

### Mode 3: Hybrid Composition (Default)
- Places deterministic vector typography over isolated AI-generated artwork.
- Sharp image processor performs background cleanup and near-white thresholding.

## Server & Database Layer
- **Framework**: Next.js App Router with TypeScript & Tailwind CSS.
- **ORM**: Prisma ORM with dual SQLite (development) / PostgreSQL (production) compatibility.
- **Providers**: Modular `OpenAIProvider`, `GeminiNanoBananaProvider`, `GoogleFontsProvider`, and `LocalStorageProvider`.

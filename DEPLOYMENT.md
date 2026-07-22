# VOWMARK Deployment Guide

VOWMARK can be deployed to Vercel, AWS, or any Node.js container environment.

## Steps
1. Set up production PostgreSQL database and set `DATABASE_URL`.
2. Configure `.env` variables (`OPENAI_API_KEY`, `GOOGLE_GEMINI_API_KEY`, `STORAGE_BUCKET`).
3. Run `npx prisma db push`.
4. Deploy using `npm run build` and `npm run start`.

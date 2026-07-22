# VOWMARK Security & Data Isolation

## Security Policies
- **API Key Isolation**: All OpenAI and Google Gemini Nano Banana requests occur strictly server-side. No private keys are exposed client-side.
- **Font File Protection**: Commercial font files are stored privately and never exposed via public URL endpoints.
- **Sanitization**: SVG vector outputs are sanitized before export to prevent XSS vulnerabilities.

/** @type {import('tailwind-merge').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vow: {
          bg: '#F8FAFC',
          paper: '#FFFFFF',
          dark: '#0F172A',
          charcoal: '#1E293B',
          champagne: '#C9A251',
          accent: '#C9A251', // User Accent Gold Hex: #C9A251
          muted: '#64748B',
          border: '#E2E8F0',
          surface: '#F1F5F9',
          success: '#16A34A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

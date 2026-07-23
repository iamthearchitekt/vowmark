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
          bg: '#FAFAFA',
          paper: '#FFFFFF',
          dark: '#000000',
          charcoal: '#18181B',
          champagne: '#C9A251',
          accent: '#C9A251', // User Accent Gold Hex: #C9A251
          muted: '#737373',
          border: '#E5E5E5',
          surface: '#F5F5F5',
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

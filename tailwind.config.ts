import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#111217',
        surfaceMuted: '#161821',
        border: '#272a35',
        text: '#f4f4f5',
        textMuted: '#a1a1aa',
        accent: '#e5e7eb',
        accentMuted: '#d4d4d8',
        success: '#4ade80',
      },
      boxShadow: {
        card: '0 12px 40px rgba(0, 0, 0, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '30rem',
      },
    },
  },
  plugins: [],
} satisfies Config;

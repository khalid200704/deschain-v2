/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Navy
        navy: {
          50: '#F8FAFC',
          100: '#F0F4F8',
          500: '#1E40AF',
          900: '#0F172A',
        },
        // Accent Gold
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        // Background Ice
        ice: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
        },
      },
    },
  },
  plugins: [],
}

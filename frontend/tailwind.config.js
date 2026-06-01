/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Dark (tetap navy untuk teks & background gelap)
        navy: {
          50:  '#F4F7F4',
          100: '#E4EDE3',
          500: '#2D6B27',
          900: '#0F1F0D',
        },
        // Accent Green — primary brand color #49913E
        gold: {
          50:  '#F2F8F1',
          100: '#DAF0D7',
          400: '#6DB863',
          500: '#49913E',
          600: '#38732F',
          700: '#2C5824',
        },
        // Background Light Green (ganti ice → green tint)
        ice: {
          50:  '#F2F8F1',
          100: '#DAF0D7',
          200: '#B5DFB0',
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#EBE6DD',
          300: '#E2DDD4',
          400: '#D5CFC5',
          500: '#C5BEB3',
        },
        terracotta: {
          500: '#DF4F38',
          600: '#CC432D',
        },
        pastel: {
          blue: '#ABC1DE',
          blueDark: '#96AFCF',
          yellow: '#EAD779',
          yellowDark: '#DBC665',
          mint: '#98C5B3',
          mintDark: '#85B3A1',
          purple: '#C5B4E3',
          rose: '#E8B4B8',
          sand: '#E3DDD3',
        },
        darkCharcoal: '#1C1917',
        subtleText: '#78746D',
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 8px 24px rgba(0, 0, 0, 0.06)',
        'terracotta': '0 10px 25px -5px rgba(223, 79, 56, 0.35)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{ts,tsx,jsx,js}',
    '!./node_modules/**',
  ],
  theme: {
    extend: {
      colors: {
        dorren: {
          black: '#000000',
          dark: '#183141',
          blue: '#85CEE4',
          gray: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.2em',
        logo: '0.4em',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

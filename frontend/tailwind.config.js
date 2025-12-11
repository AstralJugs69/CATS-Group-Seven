/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        ethio: {
          green: '#059669', // Emerald 600 - slightly brighter
          yellow: '#F59E0B', // Amber 500 - more golden
          red: '#E11D48', // Rose 600
        },
      },
    },
  },
  plugins: [],
}
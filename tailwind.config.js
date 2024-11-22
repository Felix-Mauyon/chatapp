/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'], // Replace 'sans' with any key you prefer
      },
      colors: {
        'm_blue': '#5357B6',
        'm_text' : '#67727e'
      }
    },
  },
  plugins: [],
}


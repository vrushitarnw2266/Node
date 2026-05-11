/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff6b6b',
          dark: '#ee5253',
        }
      }
    },
  },
  plugins: [],
}

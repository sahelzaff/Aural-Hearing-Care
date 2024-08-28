/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        auralyellow: '#afcc1c',
        auralblue: '#04adf0',
      },
      screens: {
        '24inch': '1920px',
        '23inch': '1920px',
        '22inch': '1680px',
        '20inch': '1600px',
        '19inch': '1440px',
        '15inch': '1366px',
        '13inch': '1024px',
        '10inch': '600px',
      },
      padding: {
        '24inch': '0 120px',
        '23inch': '0 100px',
        '22inch': '0 90px',
        '20inch': '0 80px',
        '19inch': '0 70px',
        '15inch': '0 60px',
        '13inch': '0 50px',
        '10inch': '0 40px',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#68D391', // Verde AgroBloom
        secondary: '#4299E1', // Azul NASA
        accent: '#F6E05E',  // Amarillo Flor
        neutral: '#2D3748', // Gris Oscuro de Fondo
        'base-100': '#FFFFFF', // Blanco
      },
    },
  },
  plugins: [],
};
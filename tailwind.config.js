/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Оттенки газетного листа
        newspaper: {
          light: "#fdfcf8",
          DEFAULT: "#f4f1ea", // Основной фон страницы
          dark: "#e8e4d9",
        },
        ink: "#1a1a1a", // Цвет типографской краски
      },
      backgroundImage: {
        // Наложение текстуры бумаги (зернистость)
        'paper-texture': "url('https://www.transparenttextures.com/patterns/fake-paper.png')",
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
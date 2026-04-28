/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        czech: {
          red: '#D7141A',
          blue: '#11457E',
          white: '#FFFFFF',
          cream: '#F5F0E8',
        },
      },
    },
  },
  plugins: [],
};

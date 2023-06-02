/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        reading:  '#3a4649',
        highlight: '#e6fc88',
      },
      animation: {
        "waiting-room": "waiting-room 14s infinite"
      },
      keyframes: {
        "waiting-room": {
          "12.5%, 22.5%": {
              transform: 'translateY(-12.5%)'
          },
          "25%, 35%": {
              transform: 'translateY(-25%)'
          },
          "37.5%, 47.5%": {
              transform: 'translateY(-37.5%)'
          },
          "50%, 60%": {
              transform: 'translateY(-50%)'
          },
          "62.5%, 72.5%": {
              transform: 'translateY(-62.5%)'
          },
          "75%, 85%": {
              transform: 'translateY(-75%)'
          },
          "87.5%, 100%": {
              transform: 'translateY(-87.5%)'
          },
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: 'class', // only generate classes
    }),
    require('@tailwindcss/typography'),
  ],
}
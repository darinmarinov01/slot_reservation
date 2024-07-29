/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        'screen-header-lg': 'calc(100vh - 140px)',
        '430': '430px',
      },
    },
    container: {
      center: true,
      padding: {
        sm: '0',
        lg: '0%',
        xl: '0%',
        '2xl': '5%',
      }
    }
  },
  plugins: [],
}

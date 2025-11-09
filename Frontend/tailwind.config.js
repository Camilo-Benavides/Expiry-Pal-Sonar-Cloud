/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ep-primary': '#006A69',
        'ep-on-primary': '#FFFFFF',
        'ep-primary-container': '#9CF1EF',
        'ep-on-primary-container': '#00504F',
        'ep-surface': '#F5FAFC',
        'ep-background': '#F4FBFA',
        'ep-on-surface': '#171C1E',
        'ep-outline': '#BEC9C8'
      },
      borderRadius: {
        'control': '12px',
        'card': '16px',
        'logo': '8px'
      },
      boxShadow: {
        'ep-1': '0 1px 2px rgba(0,0,0,.08),0 1px 3px rgba(0,0,0,.06)',
        'ep-2': '0 2px 8px rgba(0,0,0,.10)'
      },
      height: {
        'control': '40px'
      }
    },
  },
  plugins: [],
}

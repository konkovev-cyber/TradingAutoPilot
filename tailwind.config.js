/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3b82f6',
          dark: '#1f2937',
          light: '#f9fafb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 6px 24px -4px rgba(15, 23, 42, 0.12), 0 2px 8px -2px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 28px 70px -24px rgba(15, 23, 42, 0.28)',
      }
    },
  },
  plugins: [],
};

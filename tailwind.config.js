/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        groceries: '#FF6B6B',
        entertainment: '#4ECDC4',
        transportation: '#45B7D1',
        dining: '#F7DC6F',
        shopping: '#BB8FCE',
        utilities: '#85C1E9',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'IBMPlexMono': ['IBMPlexMono', 'sans-serif'],
        'IBMPlexMonoLight': ['IBMPlexMonoLight', 'sans-serif'],
      },      
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        background: '#0B0E14',
        textPrimary: '#E2E8F0',
        accent: '#3b82f6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'expert-avatar': 'linear-gradient(135deg, #3b82f6, #9333ea)',
        'btn-primary': 'linear-gradient(135deg, #3b82f6, #2563eb)',
        'btn-primary-hover': 'linear-gradient(135deg, #60a5fa, #3b82f6)',
        'slot-selected': 'linear-gradient(135deg, #9333ea, #6366f1)',
      }
    },
  },
  plugins: [],
}

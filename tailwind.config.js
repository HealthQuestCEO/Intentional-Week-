/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background and text
        'vanilla-sky': '#F5F0E8',
        'charcoal': '#2D2D2D',

        // Rule colors (Lycke collection)
        'orchid-mist': '#9A9BB0',
        'balanced-teal': '#3D7A7A',
        'gelato-mint': '#B8C9A8',
        'sunrise-yellow': '#D4A54A',
        'rainfall': '#7A9BA8',
        'sweet-akito-rose': '#D4856A',
        'teasel-lilac': '#B8B4C8',
        'barley-yellow': '#D9C9A8',
        'pale-coral': '#C9A89A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.3s ease-out',
        'expand': 'expand 0.3s ease-out',
        'pulse-soft': 'pulse-soft 2s infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'expand': {
          '0%': { opacity: '0', transform: 'scaleY(0.95)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

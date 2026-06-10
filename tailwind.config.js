/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mare — The Palace Company light palette
        navy: {
          900: '#0C2339',
          800: '#163450',
          700: '#1E4168',
          600: '#2A5580',
          500: '#3A6E9E',
        },
        sea: {
          50:  '#F4F8FC',
          100: '#E8F1F8',
          200: '#D0E4F1',
          300: '#A8CCDF',
          400: '#7AAFC9',
        },
        sand: {
          50:  '#FDFAF6',
          100: '#F9F4EC',
          200: '#F0E8D8',
        },
        gold: {
          400: '#C9A55A',
          500: '#B8903F',
          600: '#9A7530',
        },
        // Text
        ink: {
          900: '#0C2339',
          700: '#2C4A62',
          500: '#4E7290',
          300: '#8AAFC8',
          100: '#C5DCE8',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-sea':  'linear-gradient(160deg, #E8F1F8 0%, #F4F8FC 60%, #EFF6FA 100%)',
        'gradient-navy': 'linear-gradient(135deg, #163450 0%, #1E4168 100%)',
      },
      boxShadow: {
        'card':   '0 2px 12px 0 rgba(12,35,57,0.08), 0 1px 3px 0 rgba(12,35,57,0.05)',
        'card-md':'0 4px 20px 0 rgba(12,35,57,0.10), 0 1px 4px 0 rgba(12,35,57,0.06)',
        'card-lg':'0 8px 32px 0 rgba(12,35,57,0.12)',
        'tooltip':'0 8px 24px 0 rgba(12,35,57,0.16)',
        'navy':   '0 4px 16px 0 rgba(30,65,104,0.30)',
      },
      animation: {
        'fade-in':  'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        'ping-slow':'ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}


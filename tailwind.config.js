/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#03060F',
          900: '#070D1F',
          800: '#0D1530',
          700: '#152044',
          600: '#1E2D5A',
        },
        gold: {
          300: '#E8D5A8',
          400: '#D4BA82',
          500: '#C9A96E',
          600: '#B08D4E',
          700: '#8A6B34',
        },
        cream: {
          50:  '#FEFCF8',
          100: '#F9F5EE',
          200: '#F5F0E6',
          300: '#EDE5D4',
          400: '#DDD0B8',
        },
        slate: {
          mare: '#8896AF',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-night': 'linear-gradient(160deg, #070D1F 0%, #0D1530 50%, #152044 100%)',
        'gradient-gold':  'linear-gradient(135deg, #C9A96E 0%, #E8D5A8 50%, #C9A96E 100%)',
      },
      boxShadow: {
        'glass': '0 4px 24px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
        'gold':  '0 0 24px 0 rgba(201,169,110,0.25)',
        'glow':  '0 0 40px 0 rgba(201,169,110,0.12)',
        'card':  '0 2px 16px 0 rgba(0,0,0,0.32)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'ping-slow':  'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGold: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}


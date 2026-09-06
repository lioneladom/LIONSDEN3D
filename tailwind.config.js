/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080808',
          surface: '#111111',
          card: '#171717',
          cardHover: '#1f1f1f',
          red: '#E10600',
          redBright: '#FF2B20',
          redDark: '#8B0000',
          redGlow: 'rgba(225, 6, 0, 0.25)',
          border: '#292929',
          borderLight: '#383838',
          borderActive: '#E10600',
          text: '#FFFFFF',
          textMuted: '#A3A3A3',
          textDim: '#737373',
          metallic: '#C0C0C0',
          charcoal: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 25px -5px rgba(225, 6, 0, 0.4)',
        'red-glow-lg': '0 0 40px -5px rgba(225, 6, 0, 0.6)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'push-down': 'pushDown 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pull-out': 'pullOut 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pushDown: {
          '0%': { opacity: '0', transform: 'translateY(-50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pullOut: {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(30px)' },
          '55%': { opacity: '0.95', transform: 'scale(1.018) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        }
      },
      maxWidth: {
        'site': '1680px',
      },
    },
  },
  plugins: [],
}

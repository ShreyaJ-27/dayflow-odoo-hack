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
        background: '#090a0f',
        surface: {
          50: '#1e2235',
          100: '#181b2a',
          200: '#141624',
          300: '#0f111c',
          400: '#0b0d16',
        },
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          purple: '#8b5cf6',
          fuchsia: '#d946ef',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(168, 85, 247, 0.15)',
        'glow': '0 0 25px -5px rgba(168, 85, 247, 0.25)',
        'glow-lg': '0 0 35px -5px rgba(168, 85, 247, 0.35)',
      },
      borderColor: {
        subtle: 'rgba(255, 255, 255, 0.08)',
        glow: 'rgba(168, 85, 247, 0.3)',
      }
    },
  },
  plugins: [],
}

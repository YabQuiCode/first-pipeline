/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e8e8ec',
          300: '#d4d4dc',
          400: '#a1a1ab',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        accent: {
          blue: '#3b82f6',
          indigo: '#6366f1',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
        },
        surface: {
          primary: '#ffffff',
          secondary: '#f8f8fa',
          tertiary: '#f0f0f4',
          card: 'rgba(255, 255, 255, 0.7)',
          dark: '#1a1a2e',
        }
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

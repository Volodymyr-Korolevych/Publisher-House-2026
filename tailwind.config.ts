import type { Config } from 'tailwindcss'

export default {
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#eaf0ff',
          200: '#d6e2ff',
          300: '#b5caff',
          400: '#8aa9ff',
          500: '#5f82ff',
          600: '#3f61f0',
          700: '#3049cf',
          800: '#283ba7',
          900: '#263682'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config

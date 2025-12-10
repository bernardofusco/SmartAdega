export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b8',
          400: '#ed7591',
          500: '#e0486d',
          600: '#ca2d5b',
          700: '#aa1f4b',
          800: '#8d1d45',
          900: '#771c40',
          950: '#440a1f',
        },
        primary: {
          DEFAULT: '#8d1d45',
          light: '#aa1f4b',
          dark: '#771c40',
        },
        secondary: {
          DEFAULT: '#e0486d',
          light: '#ed7591',
          dark: '#ca2d5b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

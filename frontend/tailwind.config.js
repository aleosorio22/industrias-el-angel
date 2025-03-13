/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50', // Verde más claro y amigable
          light: '#66BB6A',
          dark: '#43A047',
        },
        secondary: {
          DEFAULT: '#81C784', // Verde suave
          light: '#A5D6A7',
          dark: '#66BB6A',
        },
        accent: {
          DEFAULT: '#E8F5E9', // Verde casi blanco
          light: '#F1F8E9',
          dark: '#C8E6C9',
        },
        cream: {
          DEFAULT: '#FFFFFF', // Blanco puro
          light: '#FFFFFF',
          dark: '#FAFAFA',
        },
        text: {
          DEFAULT: '#212121', // Negro suave para texto
          light: '#424242',
          dark: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'], // Para títulos
      },
      fontSize: {
        'display-1': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-2': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'heading-1': ['2.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-2': ['2rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        'heading-3': ['1.75rem', { lineHeight: '1.375' }],
        'heading-4': ['1.5rem', { lineHeight: '1.375' }],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(122, 62, 25, 0.07)',
        'medium': '0 4px 25px -5px rgba(122, 62, 25, 0.1)',
      },
    },
  },
  plugins: [],
}
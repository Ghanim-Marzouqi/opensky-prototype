/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - Soft Purple/Violet (Prodify-inspired)
        primary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6D28D9',
          900: '#5B21B6',
          950: '#4C1D95',
        },
        // Accent - Teal (Prodify secondary)
        accent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Surface colors for backgrounds
        surface: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          850: '#1F1F1F',
          900: '#171717',
          950: '#0A0A0A',
        },
        // Semantic colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
        // Priority colors (Prodify-style)
        coral: {
          400: '#FB7185',
          500: '#F43F5E',
        },
        lime: {
          400: '#A3E635',
          500: '#84CC16',
        },
        // Additional Prodify colors
        lavender: {
          50: '#F8F7FF',
          100: '#F1EFFF',
          200: '#E4E0FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        arabic: ['Readex Pro', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
        'gradient-accent': 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
        'gradient-success': 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        'gradient-danger': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        'gradient-dark': 'linear-gradient(180deg, #262626 0%, #171717 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #FFFFFF 0%, #F8F7FF 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(20, 184, 166, 0.03) 100%)',
        'gradient-avatar': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.2)',
        'glow-accent': '0 0 20px rgba(20, 184, 166, 0.3)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

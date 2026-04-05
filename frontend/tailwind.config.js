/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Semantic colors - mapped to CSS custom properties from design tokens
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',

        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',

        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',

        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',

        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',

        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',

        border: 'var(--color-border)',

        destructive: 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',

        ring: 'var(--color-ring)',

        // Keep dark mode fallback colors (not used with design tokens but kept for reference)
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'neon': '0 0 15px rgba(99, 102, 241, 0.4)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

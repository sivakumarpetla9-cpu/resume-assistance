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
        dark: {
          bg: '#070A0F',
          surface: '#0C1118',
          elevated: '#111822',
          highest: '#151D28',
          border: '#1C2633',
          text: '#F3F5F7',
          secondary: '#A7B0BC',
          muted: '#66717F',
          accent: '#35C6FF',
          accent2: '#4F7CFF',
          success: '#35D399',
          warning: '#F2B84B',
          error: '#F06A6A',
        },
        light: {
          bg: '#F7F8FA',
          surface: '#FFFFFF',
          elevated: '#F1F3F6',
          border: '#E2E6EB',
          text: '#10151C',
          secondary: '#4B5563',
          muted: '#7A8491',
          accent: '#0099D8',
          accent2: '#4268D8',
          success: '#159A68',
          warning: '#B77908',
          error: '#D14343',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'scan': 'scanLine 2s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 4px rgba(53, 198, 255, 0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 12px rgba(53, 198, 255, 0.8))' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

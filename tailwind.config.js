/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FA',
        foreground: '#20242C',
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F1F3F6',
          active: '#E9ECF0',
          muted: '#F8F9FB',
        },
        border: {
          DEFAULT: '#E5E8ED',
          strong: '#D0D5DD',
          subtle: '#EEF0F3',
        },
        muted: {
          DEFAULT: '#737B89',
          light: '#9AA1B0',
          dark: '#4B5565',
        },
        forma: {
          50: '#F0F4F8',
          100: '#D9E3ED',
          200: '#B5CADF',
          300: '#8FB0CE',
          400: '#6896BE',
          500: '#426B9C', // primary accent
          600: '#34567F',
          700: '#274162',
          800: '#1B2C44',
          900: '#0E1727',
        },
        accent: {
          DEFAULT: '#426B9C',
          secondary: '#7896B6',
          hover: '#35567F',
          light: '#EAF0F6',
        },
        studio: {
          bg: '#171B22',
          panel: '#1E232B',
          header: '#13161C',
          border: '#2A303C',
          text: '#F0F3F6',
          muted: '#8C95A5',
          accent: '#5E8FC2',
        },
        semantic: {
          success: '#2E7D32',
          successBg: '#EAF5EC',
          warning: '#ED6C02',
          warningBg: '#FFF6E9',
          error: '#D32F2F',
          errorBg: '#FDF0ED',
          info: '#0288D1',
          infoBg: '#EBF6FC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px -1px rgba(16, 24, 40, 0.04)',
        'dropdown': '0 4px 16px -2px rgba(16, 24, 40, 0.08), 0 2px 6px -2px rgba(16, 24, 40, 0.04)',
        'modal': '0 12px 32px -4px rgba(16, 24, 40, 0.12), 0 4px 12px -2px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
}

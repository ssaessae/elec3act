/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F3EC', // soft neutral page background
        ink: '#1B1B18', // primary text
        muted: '#5E5B52', // secondary text (6:1 contrast on paper)
        line: '#E4DFD2', // hairline borders
        leaf: { DEFAULT: '#1F5A3D', dark: '#17452F', soft: '#E4EFE8' },
        clay: '#B4471F', // cart badge accent
        danger: '#B3261E',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,27,24,.04), 0 8px 24px -12px rgba(27,27,24,.12)',
        lift: '0 2px 4px rgba(27,27,24,.05), 0 18px 40px -16px rgba(27,27,24,.25)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        bump: {
          '0%, 100%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.12)' },
          '65%': { transform: 'scale(0.97)' },
        },
        pop: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '70%': { transform: 'scale(1.25)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(.96)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(.97)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fadeUp .5s cubic-bezier(.2,.8,.2,1) both',
        'fade-in': 'fadeIn .25s ease-out both',
        bump: 'bump .45s ease-out',
        pop: 'pop .35s cubic-bezier(.2,.8,.2,1) both',
        'toast-in': 'toastIn .3s cubic-bezier(.2,.8,.2,1) both',
        'modal-in': 'modalIn .4s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};

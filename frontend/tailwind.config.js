/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#E07856',
          dark: '#C85A38',
          light: '#F4A88F',
        },
        'secondary': {
          DEFAULT: '#8B9D77',
          dark: '#6B7A5C',
          light: '#B3C5A1',
        },
        'accent': {
          DEFAULT: '#D4A574',
          glow: '#E8C9A0',
        },
        'warm-cream': '#FFF9F0',
        'surface': {
          DEFAULT: '#FFFFFF',
          dark: '#F5E6D3',
        },
        'text': {
          primary: '#2F5233',
          secondary: '#5A6C5D',
          muted: '#8B9588',
        },
        'success': '#6B9D59',
        'warning': '#E8B44C',
        'error': '#D97757',
        'info': '#7A9D9E',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Space Grotesk', 'sans-serif'],
        'accent': ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #E07856 0%, #D4A574 100%)',
        'gradient-card': 'linear-gradient(145deg, #F4A88F 0%, #E8C9A0 100%)',
        'gradient-success': 'linear-gradient(135deg, #8B9D77 0%, #B3C5A1 100%)',
      },
      boxShadow: {
        'soft': '0 10px 40px rgba(224, 120, 86, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'lifted': '0 20px 60px rgba(224, 120, 86, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)',
        'btn': '0 8px 24px rgba(224, 120, 86, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'btn-hover': '0 12px 32px rgba(224, 120, 86, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      },
      borderRadius: {
        '3xl': '24px',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(20px, -20px) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '75%': { transform: 'translate(20px, 20px) scale(1.05)' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'slide-in-right': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 8s ease-in-out infinite',
        'scroll': 'scroll 2s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}

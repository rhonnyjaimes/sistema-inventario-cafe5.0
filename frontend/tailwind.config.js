module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coffee: "#4A2C2A",
        mint: "#8FBC8F" // Color adicional requerido
      },
      darkMode: 'class', // Añade esto al nivel raíz del config
      animation: {
        float: "float 6s ease-in-out infinite",
        'slide-in-top': "slideInTop 0.8s ease-out",
        'slide-in-bottom': "slideInBottom 0.8s ease-out",
        'fade-in': "fadeIn 0.3s ease-out",
        rise: "rise 0.6s ease-out",
        'staggered-card': "staggeredCard 0.6s ease-out",
        'check': 'check 1.2s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        shake: 'shake 0.5s ease-in-out' // Animación añadida
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rise: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        staggeredCard: {
          '0%': { transform: 'translateY(30px) rotate(3deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) rotate(0)', opacity: '1' },
        },
        check: {
          '0%': { strokeDashoffset: 50 },
          '100%': { strokeDashoffset: 0 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        shake: { // Keyframes para la animación shake
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
      }
    },
  },
  plugins: [],
}
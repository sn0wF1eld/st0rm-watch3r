module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
    extend: {
      fontSize: {
        11: '11px',
        13: '13px',
        14: '14px',
        20: '20px',
        '2em': '2em'
      },
      backgroundColor: {
        'main-bg': '#20232A',
        'secondary-bg': '#33373E',
        'light-gray': '#F7F7F7',
        'half-transparent': 'rgba(0, 0, 0, 0.5)',
        'button-bg': '#262a32',
        'cyan-blue': '#42c8f1'
      },
      borderWidth: {
        1: '1px',
        5: '5px'
      },
      borderColor: {
        color: '#1499cc',
      },
      colors: {
        'light-blue': '#42c8f1',
        'dark-blue': '#1499cc'
      },
      width: {
        400: '400px',
        760: '760px',
        780: '780px',
        800: '800px',
        1000: '1000px',
        1200: '1200px',
        1400: '1400px',
      },
      height: {
        80: '80px',
      },
      minHeight: {
        590: '590px',
      },
      keyframes: {
        customRotate: {
          '0%': { transform: 'transform: rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        }
      },
      animation: {
        rotate: 'customRotate 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F8B6C8',
        secondary: '#FFD6E7',
        accent: '#E8A598',
        bg: '#FFF9FB',
        text: '#242424'
      },
      borderRadius: {
        'xl-24': '24px',
        'xl-36': '36px'
      }
    }
  },
  plugins: []
};

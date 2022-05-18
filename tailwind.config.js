const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    '*.{html,js}',
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      }
    },
    screens: {
      'maxsm': {'max': '767px'},
      // => @media (max-width: 767px) { ... }
      ...defaultTheme.screens,
    }
  }
}
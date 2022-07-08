module.exports = {
  purge: [
    './app/**/*.html',
    './app/**/*.js',
  ],
  // content: [
  //   './app/**/*.html',
  // ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

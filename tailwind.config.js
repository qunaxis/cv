import daisyui from 'daisyui';

const config = {
  content: [
    './app/**/*.html',
    './app/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
}

export default config;

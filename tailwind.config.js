const colors = require("tailwindcss/colors");

module.exports = {
  purge: { mode: "all" },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      blue: colors.blue,
      gray: colors.gray,
      indigo: colors.indigo,
      orange: colors.orange,
      white: colors.white,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

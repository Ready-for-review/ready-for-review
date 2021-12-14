const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.html", "./src/**/*.njk", "./src/**/*.md"],
  darkMode: "media",
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
  plugins: [require("@tailwindcss/typography")],
};

import typography from "@tailwindcss/typography";
import colors from "tailwindcss/colors.js";

export default {
  content: ["./src/**/*.njk", "./src/**/*.md"],
  darkMode: "media",
  theme: {
    colors: {
      blue: colors.blue,
      gray: colors.gray,
      indigo: colors.indigo,
      orange: colors.orange,
      white: colors.white,
      prussian: "#003552",
      maximumBlue: "#5eb1bf",
    },
    extend: {},
  },
  safelist: [],
  plugins: [typography],
};

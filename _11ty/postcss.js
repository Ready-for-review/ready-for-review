const tailwind = require("tailwindcss");
const postCss = require("postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const colors = require("tailwindcss/colors");

module.exports = {
  postcss: (cssCode, done) => {
    postCss([
      tailwind({
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
        plugins: [require("@tailwindcss/typography")],
      }),
      autoprefixer(),
      cssnano({ preset: "default" }),
    ])
      .process(cssCode)
      .then(
        (r) => done(null, r.css),
        (e) => done(e, null)
      );
  },
};

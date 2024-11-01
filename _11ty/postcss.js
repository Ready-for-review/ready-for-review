import typography from "@tailwindcss/typography";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postCss from "postcss";
import tailwind from "tailwindcss";
import colors from "tailwindcss/colors.js";

export const postcss = (cssCode, done) => {
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
      plugins: [typography],
    }),
    autoprefixer(),
    cssnano({ preset: "default" }),
  ])
    .process(cssCode, {
      from: "./src/site/_includes/styles/tailwind.css",
    })
    .then(
      (result) => done(null, result.css),
      (error) => done(error, null),
    );
};

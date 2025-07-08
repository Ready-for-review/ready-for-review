import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postCss from "postcss";
import * as tailwindConfig from "../tailwind.config.js";

export const postcss = (cssCode, done) => {
  postCss([
    tailwindcss(tailwindConfig),
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

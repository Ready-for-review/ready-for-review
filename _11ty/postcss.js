import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postCss from "postcss";

export const postcss = (cssCode, done) => {
  postCss([autoprefixer(), cssnano({ preset: "default" })])
    .process(cssCode, {
      from: "./src/site/_includes/styles/design.css",
    })
    .then(
      (result) => done(null, result.css),
      (error) => done(error, null),
    );
};

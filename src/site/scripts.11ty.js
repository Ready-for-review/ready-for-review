const esbuild = require("esbuild");
const { NODE_ENV = "production" } = process.env;

const isProduction = NODE_ENV === "production";

module.exports = class {
  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    await esbuild.build({
      entryPoints: ["src/scripts/index.js"],
      bundle: true,
      minify: isProduction,
      outdir: "_site/scripts",
      sourcemap: !isProduction,
      target: ["chrome58", "firefox57", "safari11", "edge16"],
    });
  }
};

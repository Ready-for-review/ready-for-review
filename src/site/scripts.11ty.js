import esbuild from "esbuild";

const { NODE_ENV = "production" } = process.env;
const isProduction = NODE_ENV === "production";

export default class {
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
      target: "es2015",
    });
  }
}

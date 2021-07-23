require("dotenv").config();
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");
const pluginPWA = require("eleventy-plugin-pwa");
const filters = require("./_11ty/filters");
const transforms = require("./_11ty/transforms");
const shortcodes = require("./_11ty/shortcodes");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPassthroughCopy("src/site/_assets");
  eleventyConfig.addPassthroughCopy("images");

  Object.keys(filters).forEach(function (filterName) {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  Object.keys(transforms).forEach(function (transformName) {
    eleventyConfig.addTransform(transformName, transforms[transformName]);
  });

  Object.keys(shortcodes).forEach(function (shortcode) {
    eleventyConfig.addShortcode(shortcode, shortcodes[shortcode]);
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginPWA, {
    swDest: "./_site/service-worker.js",
    globDirectory: "./_site",
    clientsClaim: true,
    skipWaiting: true,
  });

  eleventyConfig.addNunjucksAsyncShortcode("Image", async (src, alt) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let stats = await Image(src, {
      widths: [320, 640, 960, 1200, 1800, 2400],
      formats: ["jpeg", "webp", "png"],
      urlPath: "/images/",
      outputDir: "./_site/images/",
    });

    let lowestSrc = stats["jpeg"][3];
    let sizes = "100vw"; // Make sure you customize this!

    // return `<div class="image-wrapper"><picture> ${source} ${img} </picture></div>`;

    return `<picture>
      ${Object.values(stats)
        .map((imageFormat) => {
          return `  <source type="image/${
            imageFormat[0].format
          }" srcset="${imageFormat
            .map((entry) => `${entry.url} ${entry.width}w`)
            .join(", ")}" sizes="${sizes}">`;
        })
        .join("\n")}
        <img
        alt="${alt}"
        src="${lowestSrc.url}"

        width="${lowestSrc.width}"
        height="${lowestSrc.height}">
      </picture>`;
  });

  // make the prime target act like prod
  return {
    dir: {
      input: "src/site",
      output: "_site",
      data: `_data`,
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};

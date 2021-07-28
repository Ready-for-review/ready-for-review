require("dotenv").config();
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");
const pluginPWA = require("eleventy-plugin-pwa");
const filters = require("./_11ty/filters");
const transforms = require("./_11ty/transforms");
const shortcodes = require("./_11ty/shortcodes");

const LOCAL_DIR = "src/_site";

async function imageShortcode(src, alt, sizes = "100vw") {
  let sourcePath = `./src/images/${src}`;
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let metadata = await Image(sourcePath, {
    widths: [320, 640, 960, 1200, 1800, 2400],
    formats: ["jpeg", "webp", "png"],
    urlPath: "/images/",
    outputDir: `${LOCAL_DIR}/images/`,
  });

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[4];

  return `<picture>
    ${Object.values(metadata)
      .map((imageFormat) => {
        return `  <source type="${
          imageFormat[0].sourceType
        }" srcset="${imageFormat
          .map((entry) => entry.srcset)
          .join(", ")}" sizes="${sizes}">`;
      })
      .join("\n")}
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setPugOptions({ debug: true });

  eleventyConfig.addPassthroughCopy("./src/images");

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

  eleventyConfig.addNunjucksAsyncShortcode("Image", imageShortcode);

  // make the prime target act like prod
  return {
    dir: {
      input: "src/site",
      output: "src/_site",
      data: `_data`,
    },
    templateFormats: ["njk", "md", "html", "pug"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const filters = require("./_11ty/filters");
const transforms = require("./_11ty/transforms");
const shortcodes = require("./_11ty/shortcodes");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_tmp/style.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });
  eleventyConfig.addPassthroughCopy("src/site/_assets");

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
  eleventyConfig.addPlugin(pluginRss);

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

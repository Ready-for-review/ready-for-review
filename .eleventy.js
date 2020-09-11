const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const now = new Date();

const livePosts = (p) => p.date <= now;
module.exports = function (eleventyConfig) {
  // minify the html output
  const htmlmin = require("html-minifier");
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: false, // we need comments to identify the expcerpt split marker.
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy("src/site/_assets");

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addCollection("postsAndNotes", function (collection) {
    let res = collection
      .getAll()
      .filter(function (item) {
        return (
          item.data.tags &&
          (item.data.tags.includes("post") || item.data.tags.includes("note"))
        );
      })
      .filter(livePosts)
      .sort(function (a, b) {
        return a.date - b.date;
      });

    return res || [];
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

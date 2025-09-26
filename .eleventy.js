import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { execSync } from "child_process";
import "dotenv/config";
import * as filters from "./_11ty/filters.js";
import { CookLangPlugin } from "./_11ty/plugins.js";
import { postcss } from "./_11ty/postcss.js";
import * as shortcodes from "./_11ty/shortcodes.js";

export default function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./src/_includes/styles/design.css");
  eleventyConfig.addPassthroughCopy({ "./src/images": "/images" });
  eleventyConfig.addPassthroughCopy({
    "src/site/_includes/sections/icons": "icons",
  });

  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  Object.keys(shortcodes).forEach((shortcode) => {
    if (shortcode === "image" || shortcode === "bookCover") {
      eleventyConfig.addAsyncShortcode(shortcode, shortcodes[shortcode]);
    } else {
      eleventyConfig.addShortcode(shortcode, shortcodes[shortcode]);
    }
  });

  eleventyConfig.addNunjucksAsyncFilter("postcss", postcss);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(CookLangPlugin, {
    limitIngredientDecimals: 2,
  });

  eleventyConfig.addCollection("recipes", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter((i) => i.data.layout == "templates/recipe.njk")
      .sort((a, b) => {
        return a.data.title > b.data.title ? 1 : -1;
      });
  });

  eleventyConfig.on("eleventy.after", () => {
    execSync(`npx pagefind --site _site --glob \"**/*.html\"`, {
      encoding: "utf-8",
    });
  });

  return {
    dir: {
      input: "src/site",
      output: "_site",
      data: `_data`,
    },
    templateFormats: ["njk", "md", "html", "cook", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
}

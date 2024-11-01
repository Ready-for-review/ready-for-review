import Image from "@11ty/eleventy-img";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { execSync } from "child_process";
import "dotenv/config";
import * as filters from "./_11ty/filters.js";
import { CookLangPlugin } from "./_11ty/plugins.js";
import { postcss } from "./_11ty/postcss.js";
import * as shortcodes from "./_11ty/shortcodes.js";

const LOCAL_DIR = "src/_site";

async function imageShortcode(src, alt, sizes = "100vw") {
  let sourcePath = `./src/images/${src}`;
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on responsive image from: ${src}`);
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

export default function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setPugOptions({ debug: true });
  eleventyConfig.addWatchTarget("./src/_includes/styles/tailwind.css");

  eleventyConfig.addPassthroughCopy({ "./src/images": "/images" });

  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  Object.keys(shortcodes).forEach((shortcode) => {
    eleventyConfig.addShortcode(shortcode, shortcodes[shortcode]);
  });

  eleventyConfig.addNunjucksAsyncFilter("postcss", postcss);
  eleventyConfig.addNunjucksAsyncShortcode("Image", imageShortcode);

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

  // make the prime target act like prod
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

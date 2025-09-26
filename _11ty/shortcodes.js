import Image from "@11ty/eleventy-img";
import path from "path";

export function version() {
  return String(Date.now());
}

export function episodeContent(item) {
  return `${item["content:encoded"]}`;
}

export function buildInfo() {
  return `Version ${process.env.npm_package_version}`;
}

export function ingredient({ name, quantity, units }) {
  if (isNaN(quantity)) {
    return name;
  } else {
    return `${name}, ${quantity} ${units ? units : ""} `;
  }
}

export async function image(src, alt, className = "", sizes = "100vw") {
  let resolvedSrc = src;
  if (!path.isAbsolute(src) && !src.startsWith("http")) {
    resolvedSrc = path.join("src/site", src);
  }

  try {
    let metadata = await Image(resolvedSrc, {
      widths: [300, 600, 900, 1200],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/images/",
      urlPath: "/images/",
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      },
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    if (className) {
      imageAttributes.class = className;
    }

    return Image.generateHTML(metadata, imageAttributes);
  } catch (error) {
    console.error(`Error processing image ${src}:`, error.message);
    return `<img src="${src}" alt="${alt}" class="${className}" loading="lazy" />`;
  }
}

export async function bookCover(isbn, title, className = "") {
  if (!isbn) return "";

  const src = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

  try {
    let metadata = await Image(src, {
      widths: [110, 130, 180],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/images/books/",
      urlPath: "/images/books/",
      filenameFormat: function (id, src, width, format, options) {
        return `${isbn}-${width}w.${format}`;
      },
      cacheOptions: {
        duration: "1d",
      },
      fetchOptions: {
        timeout: 10000,
      },
    });

    let imageAttributes = {
      alt: `Buchcover: ${title}`,
      sizes: "(max-width: 480px) 110px, 130px",
      loading: "lazy",
      decoding: "async",
    };

    if (className) {
      imageAttributes.class = className;
    }

    return Image.generateHTML(metadata, imageAttributes);
  } catch (error) {
    console.warn(`Could not fetch book cover for ISBN ${isbn}:`, error.message);
    return `<div class="book-cover-placeholder ${className}">
      <div class="book-cover-placeholder__content">
        <div>📚</div>
        <div class="book-title">${title}</div>
      </div>
    </div>`;
  }
}

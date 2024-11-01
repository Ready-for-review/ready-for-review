import Parser from "rss-parser";
import cacheUtil from "../../util/cache.js";

const CACHE_FILE_PATH = "_cache/episodes.json";
const cacheHandler = cacheUtil(CACHE_FILE_PATH);

export default async function () {
  console.log(">>> Reading episodes from cache...");
  const cache = cacheHandler.readFromCache();
  if (cache && cache.items && cache.items.length) {
    console.log(`>>> ${cache.items.length} episodes loaded from cache`);
  }

  // Only fetch new mentions in production
  if (true || process.env.NODE_ENV === "production") {
    console.log(">>> Checking for new episodes...");
    let parser = new Parser();
    try {
      const loadedEpisodes = await parser.parseURL(
        "https://ready-for-review.podigee.io/feed/mp3",
      );
      if (loadedEpisodes) {
        const items = loadedEpisodes.items.map((episode) => {
          return {
            ...episode,
            enclosure: {
              ...episode.enclosure,
              url: episode.enclosure.url.replace("&source=feed", ""),
            },
          };
        });

        const episodes = {
          lastFetched: new Date().toISOString(),
          ...loadedEpisodes,
          items,
        };
        cacheHandler.writeToCache(episodes);

        return episodes;
      }
    } catch (error) {
      console.log("couldn't load episodes ", error);
      return { items: [] };
    }
  }

  return cache;
}

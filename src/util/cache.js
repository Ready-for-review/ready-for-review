import fs from "fs";

export default function cache(cachePath) {
  // save combined webmentions in cache file
  function writeToCache(data) {
    const dir = "_cache";
    const fileContent = JSON.stringify(data, null, 2);
    // create cache folder if it doesn't exist already
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    // write data to cache json file
    fs.writeFile(cachePath, fileContent, (err) => {
      if (err) throw err;
      console.log(`>>> data cached to ${cachePath}`);
    });
  }

  // get cache contents from json file
  function readFromCache() {
    if (fs.existsSync(cachePath)) {
      const cacheFile = fs.readFileSync(cachePath);
      return JSON.parse(cacheFile);
    }
    // no cache found.
    return { lastFetched: null, children: [] };
  }

  return {
    readFromCache,
    writeToCache,
  };
}

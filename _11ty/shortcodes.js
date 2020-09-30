const { version } = require("../package.json");
module.exports = {
  version: function () {
    return String(Date.now());
  },
  episodeContent: function (item) {
    return `${item["content:encoded"]}`;
  },
  buildInfo: function () {
    return `Version ${version}`;
  },
};

const { format, parseISO } = require("date-fns");
const string = require("string");

function slug(input) {
  if (!input) {
    return false;
  }
  return string(input).slugify().toString();
}

module.exports = {
  shortReadableDateFromISO: function (dateStr) {
    return format(parseISO(dateStr), "dd.MM.yyyy");
  },
  shortReadableDate: function (dateStr) {
    return format(dateStr, "dd.MM.yyyy");
  },
  toEpisodeUrl: function (episode) {
    return `${format(parseISO(episode.isoDate), "yyyy/MM/dd")}/${slug(
      episode.title,
    )}`;
  },
};

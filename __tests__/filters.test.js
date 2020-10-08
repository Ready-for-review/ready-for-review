const { shortReadableDateFromISO, toEpisodeUrl } = require("../_11ty/filters");

describe("11ty filters", function () {
  describe("toEpisodeUrl", function () {
    it("should transform an episode into the expected url", function () {
      // take only important fields of episode object for readability
      const episode = {
        title: "Episode 0",
        isoDate: "2020-09-30T20:00:00.000Z",
      };

      const expected = "2020/09/30/episode-0";
      const result = toEpisodeUrl(episode);
      expect(expected).toEqual(result);
    });
  });
  describe("shortReadableDateFromISO", function () {
    it("should transform a date as expected", function () {
      const theDate = "2020-09-30T20:00:00.000Z";
      const expected = "30.09.2020";
      const result = shortReadableDateFromISO(theDate);
      expect(expected).toEqual(result);
    });
  });
});

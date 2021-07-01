const { google } = require("googleapis");

const youTubeClient = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

module.exports = async () => {
  try {
    const response = await youTubeClient.playlistItems.list({
      playlistId: "UUnVCACzOxoOShe_69qo51hg",
      part: "id,snippet",
      order: "date",
      type: "video",
      maxResults: 30,
    });

    return response.data.items;
  } catch (error) {
    console.log(error.toString());
    return [];
  }
};

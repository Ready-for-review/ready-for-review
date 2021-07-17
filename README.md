# ready-for-review

homepage for podcast "Ready for review"

## Setup

You need the actual Node.js LTS version to build this website (other versions may work, too).

To install all dependencies please use npm to install them (yarn should work, too, but there is no support if you run into problems).

```
npm i
```

To run the site on your machine you can use a npm script:

```
npm start
```

To build the site (you'll find the result in the `_site` folder) run

```
npm run build
```

### YouTube API

We use the [googleapi](https://www.npmjs.com/package/googleapis) package to load data from YouTube and display it on our page. To get everything working you need an API key and put into an `.env` file (see `.envsample`).

This step is _optional_. If you don't care for the stream, you don't need it because everything works without it.

#### Obtaining API credentials for YouTube

- use your Google account to sign in to the [Google Developers Console](https://console.developers.google.com/)
- create a new project for the site
- [obtain authorisation credentials](https://developers.google.com/youtube/registering_an_application): go to the [credentials page](https://console.developers.google.com/apis/credentials) and click "Create credentials" there to create a new API key
- enable YouTubeData API (v3) for this key on the [developer console](https://console.developers.google.com/apis/library)
- save the key in a `.env` file here. The file is on the .gitignore

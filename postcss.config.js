module.exports = {
  plugins: [
    require(`tailwindcss`)(`./src/styles/tailwind.config.js`),
    require(`autoprefixer`),
    ...(process.env.NODE_ENV === "production"
      ? [require(`postcss-clean`)]
      : []),
  ],
};

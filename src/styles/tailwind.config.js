module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  purge: {
    content: ["_site/**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};

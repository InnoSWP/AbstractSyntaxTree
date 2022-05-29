const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");
const colors = require('tailwindcss/colors');
const { createCompilerHost } = require("typescript");

module.exports = {
  purge: {
    content: ["src/**/*.svelte", "public/index.html"],
    options: {
      defaultExtractor: (content) => [
        ...tailwindExtractor(content),
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        ),
      ],
      keyframes: true,
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      sky: colors.sky,
      green: colors.green,
      red: colors.red,
      blue: colors.blue,
      yellow: colors.yellow,
      gray: colors.gray,
      amber: colors.amber,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

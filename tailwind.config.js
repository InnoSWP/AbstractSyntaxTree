const { tailwindExtractor } = require('tailwindcss/lib/lib/purgeUnusedStyles')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['src/**/*.svelte', 'public/index.html'],
    options: {
      defaultExtractor: (content) => [
        ...tailwindExtractor(content),
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        )
      ],
      keyframes: true
    }
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      white: colors.white,
      sky: colors.sky,
      green: colors.green,
      red: colors.red,
      blue: colors.blue,
      yellow: colors.yellow,
      gray: colors.gray,
      amber: colors.amber,
      identifier: '#00f',
      literal: '#164',
      keyword: '#708',
      treebg: '#efefef'
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}

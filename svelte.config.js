const sveltePreprocess = require('svelte-preprocess');
const production = !process.env.ROLLUP_WATCH;

const preprocessOptions = {
  sourceMap: !production, // "you would always want sourcemaps for the IDE" – dummdidumm
  defaults: {
    script: "typescript",
    style: "scss",
  },
  scss: {
    // prependData: `@import 'src/styles/_variables.scss';`
  },
  postcss: {
    plugins: [
      require('autoprefixer')(),
      require("tailwindcss")
    ]
  }
};


module.exports = {
  preprocess: sveltePreprocess(preprocessOptions),
  // Export this to allow rollup.config.js to inherit the same preprocess options.
  preprocessOptions,
};
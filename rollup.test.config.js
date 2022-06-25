import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import multi from "@rollup/plugin-multi-entry";
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";

const preprocessOptions = require("./svelte.config").preprocessOptions;
const production = !process.env.ROLLUP_WATCH;

export default {
  input: "spec/**/*.spec.ts",
  output: {
    sourcemap: true,
    format: "cjs",
    name: "tests",
    file: `build/bundle-tests.js`
  },
  plugins: [
    multi(),
    svelte({
         preprocess: sveltePreprocess({
           ...preprocessOptions
         }),
        compilerOptions: {
          dev: !production
        },
      }),
    css({ output: "bundle.css" }),
    resolve({
        browser: true,
        dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    })
  ],
  onwarn (warning, warn) {
    if (warning.code === "UNRESOLVED_IMPORT") return;
    warn(warning);
  },
  external: [
    "canvas-prebuilt",
    "canvas",
    "jsdom/lib/jsdom/utils",
    "jsdom/lib/jsdom/living/generated/utils",
    "jsdom",
    "xmldom",
]
};


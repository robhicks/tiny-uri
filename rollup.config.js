const buble = require("rollup-plugin-buble");
const path = require("path");
const root = process.cwd();
const terser = require("rollup-plugin-terser-js");
const server = require("rollup-plugin-live-server");

let entry = path.resolve(root, "src", "TinyUri.js");

export default [
  {
    input: entry,
    plugins: [],
    output: {
      name: "TinyUri",
      file: path.resolve(root, "dist", "tiny-uri.iife.js"),
      format: "iife"
    }
  },
  {
    input: entry,
    plugins: [terser()],
    output: {
      name: "TinyUri",
      file: path.resolve(root, "dist", "tiny-uri.iife.min.js"),
      format: "iife"
    }
  },
  {
    input: entry,
    plugins: [],
    output: {
      file: path.resolve(root, "dist", "tiny-uri.cjs.js"),
      format: "cjs"
    }
  },
  {
    input: entry,
    plugins: [
      server({
        port: 8001,
        host: "0.0.0.0",
        root: ".",
        file: "mocha.html",
        mount: [
          ["/dist", "./dist"],
          ["/src", "./src"],
          ["/node_modules", "./node_modules"]
        ],
        open: false,
        wait: 500
      })
    ],
    output: {
      file: path.resolve(root, "dist", "tiny-uri.mjs"),
      format: "es"
    }
  },
  {
    input: entry,
    plugins: [terser()],
    output: {
      file: path.resolve(root, "dist", "tiny-uri.min.mjs"),
      format: "es"
    }
  }
];

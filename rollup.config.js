const buble = require('rollup-plugin-buble');
const babili = require('rollup-plugin-babili');
const uglify = require('rollup-plugin-uglify');
const path = require('path');
const root = process.cwd();

let entry = path.resolve(root, 'src', 'TinyUri.js');

export default [
	{
    input: entry,
    plugins: [
      buble()
    ],
    name: 'TinyUri',
    output: {
      file: path.resolve(root, 'dist', 'tiny-uri.iife.js'),
      format: 'iife'
    }
  },
	{
    input: entry,
    plugins: [
      buble(),
			uglify()
    ],
    name: 'TinyUri',
    output: {
      file: path.resolve(root, 'dist', 'tiny-uri.iife.min.js'),
      format: 'iife'
    }
  },
	{
    input: entry,
    plugins: [
      buble()
    ],
    output: {
      file: path.resolve(root, 'dist', 'tiny-uri.cjs.js'),
      format: 'cjs'
    }
  },
	{
    input: entry,
    plugins: [
      buble()
    ],
    output: {
      file: path.resolve(root, 'dist', 'tiny-uri.es.js'),
      format: 'es'
    }
  },
	{
    input: entry,
    plugins: [
    ],
    output: {
      file: path.resolve(root, 'dist', 'tiny-uri.mjs'),
      format: 'es'
    }
  }
];

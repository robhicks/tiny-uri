import { terser } from 'rollup-plugin-terser';
const path = require('path');
const root = process.cwd();

let entry = path.resolve(root, 'src', 'TinyUri.js');

export default [
	{
    input: entry,
    plugins: [
    ],
    output: {
			name: 'TinyUri',
      file: path.resolve(root, 'dist', 'tiny-uri.iife.js'),
      format: 'iife'
    }
  },
	{
    input: entry,
    plugins: [
			terser()
    ],
    output: {
			name: 'TinyUri',
      file: path.resolve(root, 'dist', 'tiny-uri.iife.min.js'),
      format: 'iife'
    }
  },
	{
    input: entry,
    plugins: [
    ],
    output: {
      file: path.resolve(root, 'dist', 'tiny-uri.cjs.js'),
      format: 'cjs'
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
  },
	{
    input: entry,
    plugins: [
			terser()
    ],
    output: {
      file: path.resolve(root, 'dist', 'tiny-uri.min.mjs'),
      format: 'es'
    }
  }
];

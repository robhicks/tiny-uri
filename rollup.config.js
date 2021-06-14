import { resolve } from 'path';
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import {liveServer} from 'rollup-plugin-live-server';
import nodeResolve from '@rollup/plugin-node-resolve';

const root = process.cwd();
const production = !process.env.ROLLUP_WATCH;
const entry = resolve(root, "src", "TinyUri.js");

const plugins = [nodeResolve(), commonjs()];

export default [
  {
    input: entry,
    plugins,
    output: {
      exports: 'auto',
      file: resolve(root, "index.js"),
      format: "cjs"
    }
  },
  {
    input: entry,
    plugins,
    output: {
      exports: 'auto',
      file: resolve(root, "index.mjs"),
      format: "es"
    }
  },
  {
    input: entry,
    plugins: [...plugins],
    output: {
      exports: 'auto',
      file: resolve(root, "dist", "tiny-uri.js"),
      format: "es"
    }
  },
  {
    input: entry,
    plugins: [...plugins, terser()],
    output: {
      exports: 'auto',
      file: resolve(root, "dist", "tiny-uri.min.js"),
      format: "es"
    }
  },
  {
    input: resolve(root, 'test', 'tests.js'),
    plugins: [...plugins, !production && liveServer({
			file: 'mocha.html',
			port: 3001,
      host: '0.0.0.0',
      root: './test',
      mount: [
        [ '/dist', './dist' ],
        [ '/node_modules', './node_modules' ],
        [ '/src', './src' ],
        [ '/test', './test' ]
      ],
      open: false,
      wait: 500
		})],
    output: {
      exports: 'auto',
      file: resolve(root, "test", "test-bundle.js"),
      format: "cjs"
    }
  }
];

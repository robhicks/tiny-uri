import { resolve } from 'path'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

const root = process.cwd()
const entry = resolve(root, 'src', 'TinyUri.js')

const plugins = [nodeResolve(), commonjs()]

export default [
  {
    input: entry,
    plugins,
    output: {
      exports: 'auto',
      file: resolve(root, 'index.js'),
      format: 'cjs'
    }
  },
  {
    input: entry,
    plugins,
    output: {
      exports: 'auto',
      file: resolve(root, 'index.mjs'),
      format: 'es'
    }
  },
  {
    input: entry,
    plugins: [...plugins],
    output: {
      exports: 'auto',
      file: resolve(root, 'dist', 'tiny-uri.js'),
      format: 'es'
    }
  },
  {
    input: entry,
    plugins: [...plugins, terser()],
    output: {
      exports: 'auto',
      file: resolve(root, 'dist', 'tiny-uri.min.js'),
      format: 'es'
    }
  }
]

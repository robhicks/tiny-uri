const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify-es');

module.exports = {
	entry: 'src/TinyUri.js',
	external: [],
	globals: {
	},
	plugins: [
		buble()
	],
	targets: [
		{
			dest: 'dist/tiny-uri.cjs.js',
			format: 'cjs',
		},
		{
			dest: 'dist/tiny-uri.es.js',
			format: 'es',
		},
		{
			dest: 'dist/tiny-uri.iife.js',
			format: 'iife',
			moduleName: 'TinyUri'
		}
	]
};

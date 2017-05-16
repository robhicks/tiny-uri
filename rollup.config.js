const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify-es');

module.exports = {
	entry: 'src/Uri.js',
	external: [],
	globals: {
	},
	plugins: [
		buble(),
		uglify()
	],
	targets: [
		{
			dest: 'dist/Uri.cjs.js',
			format: 'cjs',
		},
		{
			dest: 'dist/Uri.es.js',
			format: 'es',
		},
		{
			dest: 'dist/Uri.iife.js',
			format: 'iife',
			moduleName: 'Uri'
		}
	]
};

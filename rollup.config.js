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
			dest: 'dist/uri-.cjs.js',
			format: 'cjs',
		},
		{
			dest: 'dist/uri-.es.js',
			format: 'es',
		},
		{
			dest: 'dist/uri-.iife.js',
			format: 'iife',
			moduleName: 'Uri'
		}
	]
};

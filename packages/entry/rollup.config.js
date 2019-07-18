import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import es3 from 'rollup-plugin-es3'

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'entry',
			file: pkg.browser,
			format: 'umd',
			legacy: true
		},
		// external: ['validate'],
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			es3()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'src/index.js',
		// external: ['validate'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	}
];
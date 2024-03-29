import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sass from 'rollup-plugin-sass';
import pkg from './package.json';

export default [
	{
		input: 'src/index.js',
		output: {
			name: 'api',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			sass({
				insert: true
			  }),
			resolve(),
			commonjs()
		]
	},
	{
		input: 'src/index.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			sass({
				insert: true
			  }),
			resolve(),
			commonjs() 
		]
	}
];
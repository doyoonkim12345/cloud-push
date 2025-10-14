// rslib.config.ts
import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
	source: {
		tsconfigPath: './tsconfig.json',
	},
	lib: [
		{
			id: 'browser',
			format: 'esm',
			syntax: 'es2021',
			bundle: false, // bundleless
			output: {
				target: 'web',
				distPath: { root: 'dist.browser' },
				externals: ['react', 'react-dom', 'next', 'next/navigation', '@tanstack/react-query'],
				legalComments: 'none',
				minify: false,
			},
			source: {
				entry: {
<<<<<<< Updated upstream
					index: "./src/index.ts",
=======
					'index': ['./src/browser/**', '!./src/server/**'],
>>>>>>> Stashed changes
				},
			},
			dts: true,
		},
		{
			id: 'server',
			format: 'esm',
			syntax: 'es2021',
			bundle: false, // bundleless
			output: {
				target: 'node',
				distPath: { root: 'dist.server' },
				externals: ['react', 'next', 'next/server', '@tanstack/react-query'],
				legalComments: 'none',
				minify: false,
			},
			source: {
				entry: {
<<<<<<< Updated upstream
					index: "./src/index.ts",
=======
					'index': ['./src/server/**', '!./src/browser/**'],
>>>>>>> Stashed changes
				},
			},
			dts: true,
		},
	],

	plugins: [pluginReact()],
});

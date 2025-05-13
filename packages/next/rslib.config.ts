import { defineConfig } from "@rslib/core";

export default defineConfig({
	output: {
		copy: [
			{
				from: "./src/templates",
				to: "templates",
			},
		],
	},
	lib: [
		{
			format: "esm",
			dts: true,
			source: {
				entry: {
					index: "./src/index.ts",
					cli: "./src/cli/index.ts",
					node: "./src/node.ts",
				},
			},
			autoExternal: {
				dependencies: true,
				peerDependencies: true,
				optionalDependencies: true,
				devDependencies: false,
			},
		},
		{
			format: "cjs",
			dts: true,
			source: {
				entry: {
					index: "./src/index.ts",
					cli: "./src/cli/index.ts",
					node: "./src/node.ts",
				},
			},
			autoExternal: {
				dependencies: true,
				peerDependencies: true,
				optionalDependencies: true,
				devDependencies: false,
			},
		},
	],
});

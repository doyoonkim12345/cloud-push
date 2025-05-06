import { defineConfig } from "@rslib/core";

export default defineConfig({
	lib: [
		{
			format: "esm",
			dts: true,
			source: {
				entry: {
					index: "./src/index.ts",
					node: "./src/node.ts",
				},
			},
		},
		{
			format: "cjs",
			dts: true,
			source: {
				entry: {
					index: "./src/index.ts",
					node: "./src/node.ts",
				},
			},
		},
	],
});

import { defineConfig } from "@rslib/core";

export default defineConfig({
	output: {
		copy: [
			{
				from: "./src/next/templates",
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
					config: "./src/expo/config.ts",
				},
			},
		},
		{
			format: "cjs",
			dts: true,
			source: {
				entry: {
					index: "./src/index.ts",
					config: "./src/expo/config.ts",
				},
			},
		},
	],
});

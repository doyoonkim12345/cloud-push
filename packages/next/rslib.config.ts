import { defineConfig } from "@rslib/core";

export default defineConfig({
	lib: [
		{
			format: "esm",
			dts: true,
			source: {
				entry: {
					config: "./src/config.ts",
				},
			},
		},
		{
			format: "cjs",
			dts: true,
			source: {
				entry: {
					config: "./src/config.ts",
				},
			},
		},
	],
});

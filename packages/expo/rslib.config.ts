import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      dts: true,
      source: {
        entry: {
          index: "./src/index.ts",
        },
      }
    },
    {
      format: "cjs",
      dts: true,
      source: {
        entry: {
          index: "./src/index.ts"
        },
      },
    },
  ],
});

import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      dts: true,
      source: {
        entry: {
          s3: "./src/features/s3/index.ts",
          utils: "./src/features/utils/index.ts",
          versionCursor: "./src/features/versionCursor/index.ts",
        },
      },
    },
    {
      format: "cjs",
      dts: true,
      source: {
        entry: {
          s3: "./src/features/s3/index.ts",
          utils: "./src/features/utils/index.ts",
          versionCursor: "./src/features/versionCursor/index.ts",
        },
      },
    },
  ],
});

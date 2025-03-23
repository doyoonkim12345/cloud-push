import { cosmiconfig } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";

import { getCwd } from "@/lib/getCwd";
import { Config } from "@/config";

const MODULE_NAME = "eas-update";

export const loadConfig = async (): Promise<Config> => {
  const result = await cosmiconfig(MODULE_NAME, {
    stopDir: getCwd(),
    searchPlaces: [
      "package.json",
      `${MODULE_NAME}.config.js`,
      `${MODULE_NAME}.config.cjs`,
      `${MODULE_NAME}.config.mjs`,
      `${MODULE_NAME}.config.ts`,
    ],
    ignoreEmptySearchPlaces: false,
    loaders: {
      ".ts": TypeScriptLoader(),
      ".mts": TypeScriptLoader(),
      ".cts": TypeScriptLoader(),
    },
  }).search();

  if (!result?.config) {
    throw new Error("Failed to find config");
  }

  if (typeof result.config === "function") {
    return await result.config();
  }

  return result.config as Config;
};

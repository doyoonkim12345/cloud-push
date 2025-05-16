import { cosmiconfig } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";
import { getCwd } from "@cloud-push/cloud";
import type { CliConfig } from "@/expo/config";

const MODULE_NAME = "cloud-push";

export const loadConfig = async (): Promise<CliConfig> => {
	try {
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

		return result.config as CliConfig;
	} catch (e) {
		throw new Error(e as any);
	}
};

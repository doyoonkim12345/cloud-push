import { cosmiconfigSync } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";
import { getCwd } from "@cloud-push/core";
import type { DbClient, StorageClient } from "@cloud-push/cloud";

const MODULE_NAME = "cloud-push";

export const loadConfig = (): { db: DbClient; storage: StorageClient } => {
	try {
		const result = cosmiconfigSync(MODULE_NAME, {
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
			return result.config();
		}

		return result.config;
	} catch (e) {
		throw new Error(e as any);
	}
};

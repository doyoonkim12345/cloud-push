import type { DbClient, StorageClient } from "@cloud-push/cloud";
import type { ENV_SOURCE } from "@/types";

export type Config = {
	storage: StorageClient;
	db: DbClient;
	runtimeVersion?: string;
	channel?: string;
	envSource?: ENV_SOURCE;
	checkStatusUrl?: string;
};

export const defineConfig = async (config: () => Promise<Config> | Config) => {
	const definedConfig = await config();
	return definedConfig;
};

export * from "@/lib/getUpdateStatus";

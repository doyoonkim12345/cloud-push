import type { DbClient, StorageClient } from "@cloud-push/cloud";

export type Config = {
	runtimeVersion?: string;
	storage: StorageClient;
	db: DbClient;
};

export const defineConfig = async (config: () => Promise<Config> | Config) => {
	const definedConfig = await config();
	return definedConfig;
};

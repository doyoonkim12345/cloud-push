import type { StorageClient } from "@cloud-push/cloud";

export type CliConfig = {
	storage: StorageClient;
};

export const defineConfig = async (
	config: () => Promise<CliConfig> | CliConfig,
) => {
	const definedConfig = await config();
	return definedConfig;
};

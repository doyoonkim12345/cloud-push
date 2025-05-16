import type { DbClient, Environment, StorageClient } from "@cloud-push/cloud";
import type { ENV_SOURCE } from "@/types";

export type CliConfig = {
	loadClients: () => { storage: StorageClient; db: DbClient };
	runtimeVersion?: string;
	channel?: string;
	envSource?: ENV_SOURCE;
	environment?: Environment;
};

export const defineConfig = async (
	config: () => Promise<CliConfig> | CliConfig,
) => {
	const definedConfig = await config();
	return definedConfig;
};

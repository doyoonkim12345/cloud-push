import type { DbClient, StorageClient } from "@cloud-push/cloud";
export type Config = {
    runtimeVersion?: string;
    storage: StorageClient;
    db: DbClient;
};
export declare const defineConfig: (config: () => Promise<Config> | Config) => Promise<Config>;
//# sourceMappingURL=config.d.ts.map
export * from "./lib";
import type { DbClient, StorageClient } from "@cloud-push/cloud";
export type Config = {
    storage: StorageClient;
    db: DbClient;
};
export declare const defineConfig: (config: () => Promise<Config> | Config) => Promise<Config>;
//# sourceMappingURL=index.d.ts.map
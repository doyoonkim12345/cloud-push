import { Storage } from "./types";
export type Config = {
    storage: Storage;
    runtimeVersion?: string;
};
export declare const defineConfig: (config: Config) => Promise<Config>;
//# sourceMappingURL=config.d.ts.map
import { ENV_KEY } from "../features/env/types";
export declare function exportExpoConfig({ expoConfigPath, env, }: {
    expoConfigPath: string;
    env: Partial<{
        [K in ENV_KEY]: string;
    }>;
}): Promise<void>;
//# sourceMappingURL=exportExpoConfig.d.ts.map
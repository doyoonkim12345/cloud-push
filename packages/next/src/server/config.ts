export type NextConfig = {
    codeSigningPrivateKey?: string;
};

export const defineConfig = async (
    config: () => Promise<NextConfig> | NextConfig,
) => {
    const definedConfig = await config();
    return definedConfig;
};

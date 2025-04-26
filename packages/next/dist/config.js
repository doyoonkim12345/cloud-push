const defineConfig = async (config)=>{
    const definedConfig = await config();
    return definedConfig;
};
export { defineConfig };

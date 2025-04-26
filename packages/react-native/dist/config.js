import __rslib_shim_module__ from 'module';
/*#__PURE__*/ import.meta.url;
const defineConfig = async (config)=>{
    const definedConfig = await config();
    return definedConfig;
};
export { defineConfig };

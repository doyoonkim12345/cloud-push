function generateBrowserClient(obj) {
    return async (key, ...args)=>{
        const value = obj[key];
        if ("function" == typeof value) return await value(...args);
        return Promise.resolve(value);
    };
}
export { generateBrowserClient };

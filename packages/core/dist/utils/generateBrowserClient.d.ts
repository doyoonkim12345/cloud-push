type AsyncReturn<T> = T extends (...args: any[]) => infer R ? R extends Promise<infer P> ? Promise<P> : Promise<R> : Promise<T>;
export declare function generateBrowserClient<T>(obj: T): <K extends keyof T>(key: K, ...args: T[K] extends (...args: infer P) => unknown ? P : []) => Promise<AsyncReturn<T[K]>>;
export {};
//# sourceMappingURL=generateBrowserClient.d.ts.map
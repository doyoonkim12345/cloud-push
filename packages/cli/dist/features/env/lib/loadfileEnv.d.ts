import { Environment } from "@cloud-push/core";
import { ENV_KEY } from "../types";
export declare function loadFileEnv<T extends ENV_KEY>(environment: Environment, keys: T[]): Promise<{
    [key in T]: string;
}>;
//# sourceMappingURL=loadFileEnv.d.ts.map
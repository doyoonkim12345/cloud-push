import { Environment } from "@cloud-push/core";
import { ENV_KEY } from "../types";
export declare function loadLocalEnv<T extends ENV_KEY>(environment: Environment, keys: T[]): Promise<{
    [key in T]: string;
}>;
//# sourceMappingURL=loadLocalEnv.d.ts.map
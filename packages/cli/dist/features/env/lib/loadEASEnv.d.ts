import { type Environment } from "@cloud-push/core";
import { ENV_KEY } from "../types";
export declare function loadEASEnv<T extends ENV_KEY>(environment: Environment, keys: T[]): Promise<{
    [key in T]: string;
}>;
//# sourceMappingURL=loadEASEnv.d.ts.map
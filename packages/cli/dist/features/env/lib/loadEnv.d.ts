import { Environment } from "@cloud-push/core";
import { ENV_KEY, ENV_SOURCE } from "../types";
export declare function loadEnv<T extends ENV_KEY>(envSource: ENV_SOURCE, environment: Environment, keys: T[]): Promise<{ [key in T]: string; }>;
//# sourceMappingURL=loadEnv.d.ts.map
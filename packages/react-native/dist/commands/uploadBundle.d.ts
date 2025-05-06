import type { Config } from "../config";
import type { Environment, Platform } from "@cloud-push/core";
export interface DeploymentConfig {
    bundleId: string;
    cloudPath: string;
    platforms: Platform[];
    environment: Environment;
    runtimeVersion: string;
    config: Config;
    envSource: ENV_SOURCE;
}
export declare function uploadBundle(deploymentConfig: DeploymentConfig, bundlePath: string): Promise<void>;
//# sourceMappingURL=uploadBundle.d.ts.map
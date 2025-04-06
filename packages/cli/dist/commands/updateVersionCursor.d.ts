import { Environment, Platform } from "@cloud-push/core";
import { VersionCursor } from "@cloud-push/core/version-cursor";
export declare function updateVersionCursor(currentVersionCursor: VersionCursor, { runtimeVersion, environment, bundleId, platforms, }: {
    runtimeVersion: string;
    environment: Environment;
    bundleId: string;
    platforms: Platform[];
}): VersionCursor;
//# sourceMappingURL=updateVersionCursor.d.ts.map
import type { Environment, Platform } from "@cloud-push/core";
interface ExportBundlesProps {
    platforms: Platform[];
    bundlePath: string;
    environment: Environment;
}
export declare function exportBundles({ platforms, bundlePath, environment, }: ExportBundlesProps): Promise<void>;
export {};
//# sourceMappingURL=exportBundles.d.ts.map
import type { Platform } from "@cloud-push/core";
interface ExportBundlesProps {
    platforms: Platform[];
    bundlePath: string;
}
export declare function exportBundles({ platforms, bundlePath, }: ExportBundlesProps): Promise<void>;
export {};
//# sourceMappingURL=exportBundles.d.ts.map
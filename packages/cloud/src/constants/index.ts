import * as path from "node:path";

export const generateRuntimeVersionUpdateStatusKey = (branchId: string) => path.join(branchId, `updateStatus.json`);

export const generateBranchMetadataKey = (branchId: string) => path.join(branchId, "metadata.json");

export const generateRuntimeVersionMetadataKey = () => path.join("metadata.json");

export const generateCloudPath = (branchId: string, updateGroupId: string) => path.join(branchId, updateGroupId);

export const generateManifestKey = (cloudPath: string, platform: string) => path.join(cloudPath, `manifest-${platform}.json`);

export const generateLocalManifestPath = (bundlePath: string, platform: string) => path.join(bundlePath, `manifest-${platform}.json`);
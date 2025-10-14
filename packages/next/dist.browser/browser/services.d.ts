import type { BranchMetadata, ExpoBranch, RuntimeVersionMetadata, RuntimeVersionUpdateStatus } from "@cloud-push/cloud";
export declare const services: {
    getBranches: () => Promise<ExpoBranch[]>;
    getBranchMetadata: (branchId: string) => Promise<BranchMetadata>;
    getRuntimeVersionMetadata: () => Promise<RuntimeVersionMetadata>;
    getRuntimeVersionUpdateStatus: (branchId: string) => Promise<RuntimeVersionUpdateStatus>;
    updateRuntimeVersionUpdateStatus: (branchId: string, runtimeVersionUpdateStatus: RuntimeVersionUpdateStatus) => Promise<void>;
    updateBranchMetadata: (branchId: string, updateGroupId: string, branchMetadata: BranchMetadata) => Promise<void>;
};
//# sourceMappingURL=services.d.ts.map
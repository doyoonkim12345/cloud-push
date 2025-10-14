export declare const runtimeVersionQueries: {
    all: {
        queryKey: string[];
    };
    metadata: () => {
        queryKey: string[];
        queryFn: () => Promise<import("@cloud-push/cloud").RuntimeVersionMetadata>;
    };
    updateStatus: (branchId: string) => {
        queryKey: string[];
        queryFn: () => Promise<import("@cloud-push/cloud").RuntimeVersionUpdateStatus>;
    };
};
//# sourceMappingURL=runtimeVersionQueries.d.ts.map
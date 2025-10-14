export declare const branchMetadataQueries: {
    all: {
        queryKey: string[];
    };
    metadata: (branchId: string) => {
        queryKey: string[];
        queryFn: () => Promise<import("@cloud-push/cloud").BranchMetadata>;
    };
};
//# sourceMappingURL=branchMetadataQueries.d.ts.map
export declare const branchQueries: {
    all: {
        queryKey: string[];
    };
    detail: () => {
        queryKey: string[];
        queryFn: () => Promise<import("@cloud-push/cloud").ExpoBranch[]>;
    };
};
//# sourceMappingURL=branchQueries.d.ts.map
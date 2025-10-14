import { services } from "../services";

export const branchMetadataQueries = {
    all: {
        queryKey: ["branchMetadata"],
    },
    metadata: (branchId: string) => ({
        queryKey: [...branchMetadataQueries.all.queryKey, 'metadata', branchId],
        queryFn: async () => {
            return services.getBranchMetadata(branchId)
        },
    }),
};

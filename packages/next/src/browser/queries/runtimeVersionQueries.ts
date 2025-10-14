import { services } from "../services"

export const runtimeVersionQueries = {
    all: {
        queryKey: ["runtimeVersionMetadata"],
    },
    metadata: () => ({
        queryKey: [...runtimeVersionQueries.all.queryKey, 'metadata'],
        queryFn: async () => {
            return services.getRuntimeVersionMetadata()
        },
    }),
    updateStatus: (branchId: string) => ({
        queryKey: [...runtimeVersionQueries.all.queryKey, 'updateStatus', branchId],
        queryFn: async () => {
            return services.getRuntimeVersionUpdateStatus(branchId)
        },
    }),
}
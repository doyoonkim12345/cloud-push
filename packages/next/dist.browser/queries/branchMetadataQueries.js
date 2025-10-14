import { services } from "../services.js";

;// CONCATENATED MODULE: external "../services.js"

;// CONCATENATED MODULE: ./src/browser/queries/branchMetadataQueries.ts

const branchMetadataQueries = {
    all: {
        queryKey: [
            "branchMetadata"
        ]
    },
    metadata: (branchId)=>({
            queryKey: [
                ...branchMetadataQueries.all.queryKey,
                'metadata',
                branchId
            ],
            queryFn: async ()=>{
                return services.getBranchMetadata(branchId);
            }
        })
};

export { branchMetadataQueries };

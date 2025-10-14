import { services } from "../services.js";

;// CONCATENATED MODULE: external "../services.js"

;// CONCATENATED MODULE: ./src/browser/queries/runtimeVersionQueries.ts

const runtimeVersionQueries = {
    all: {
        queryKey: [
            "runtimeVersionMetadata"
        ]
    },
    metadata: ()=>({
            queryKey: [
                ...runtimeVersionQueries.all.queryKey,
                'metadata'
            ],
            queryFn: async ()=>{
                return services.getRuntimeVersionMetadata();
            }
        }),
    updateStatus: (branchId)=>({
            queryKey: [
                ...runtimeVersionQueries.all.queryKey,
                'updateStatus',
                branchId
            ],
            queryFn: async ()=>{
                return services.getRuntimeVersionUpdateStatus(branchId);
            }
        })
};

export { runtimeVersionQueries };

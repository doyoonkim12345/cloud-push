import { services } from "../services.js";

;// CONCATENATED MODULE: external "../services.js"

;// CONCATENATED MODULE: ./src/browser/queries/branchQueries.ts

const branchQueries = {
    all: {
        queryKey: [
            "branch"
        ]
    },
    detail: ()=>({
            queryKey: [
                ...branchQueries.all.queryKey
            ],
            queryFn: services.getBranches
        })
};

export { branchQueries };

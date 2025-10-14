import { getBranchMetadata, updateBranchMetadata } from "./apis/branchMetadata.js";
import { ErrorResponse } from "./responses/ErrorResponse.js";
import { getBranches } from "./apis/branches.js";
import { getManifest } from "./apis/manifest.js";
import { getRuntimeVersionMetadata } from "./apis/runtimeVersionMetadata.js";
import { getRuntimeVersionUpdateStatus, updateRuntimeVersionUpdateStatus } from "./apis/runtimeVersionUpdateStatus.js";
import { getStatus } from "./apis/status.js";

;// CONCATENATED MODULE: external "./apis/branchMetadata.js"

;// CONCATENATED MODULE: external "./responses/ErrorResponse.js"

;// CONCATENATED MODULE: external "./apis/branches.js"

;// CONCATENATED MODULE: external "./apis/manifest.js"

;// CONCATENATED MODULE: external "./apis/runtimeVersionMetadata.js"

;// CONCATENATED MODULE: external "./apis/runtimeVersionUpdateStatus.js"

;// CONCATENATED MODULE: external "./apis/status.js"

;// CONCATENATED MODULE: ./src/server/handlers.ts







const GET = async ({ request, params, storageClient, expoClient })=>{
    const { cloudPush: [path] } = await params.params;
    switch(path.trim()){
        case 'manifest':
            return getManifest({
                request,
                storageClient
            });
        case 'status':
            return getStatus({
                request,
                storageClient,
                expoClient
            });
        case 'branches':
            return getBranches({
                expoClient
            });
        case 'branchMetadata':
            return getBranchMetadata({
                request,
                storageClient
            });
        case 'runtimeVersionMetadata':
            return getRuntimeVersionMetadata({
                storageClient
            });
        case 'runtimeVersionUpdateStatus':
            return getRuntimeVersionUpdateStatus({
                request,
                storageClient
            });
        default:
            return ErrorResponse(new Error("Not Found " + path));
    }
};
const POST = async ({ request, params, storageClient })=>{
    const { cloudPush: [path] } = await params.params;
    switch(path){
        case 'runtimeVersionUpdateStatus':
            return updateRuntimeVersionUpdateStatus({
                request,
                storageClient
            });
        case 'branchMetadata':
            return updateBranchMetadata({
                request,
                storageClient
            });
        default:
            return ErrorResponse(new Error("Not Found"));
    }
};
const handlers = ({ storageClient, expoClient })=>({
        GET: (request, params)=>GET({
                request,
                storageClient,
                expoClient,
                params
            }),
        POST: (request, params)=>POST({
                request,
                storageClient,
                params
            })
    });

export { handlers };

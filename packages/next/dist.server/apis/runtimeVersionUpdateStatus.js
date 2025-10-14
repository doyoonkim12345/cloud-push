import { createJsonUint8Array, generateRuntimeVersionUpdateStatusKey, parseFileAsJson } from "@cloud-push/cloud";
import { ErrorResponse } from "../responses/ErrorResponse.js";
import { JsonResponse } from "../responses/JsonResponse.js";

;// CONCATENATED MODULE: external "@cloud-push/cloud"

;// CONCATENATED MODULE: external "../responses/ErrorResponse.js"

;// CONCATENATED MODULE: external "../responses/JsonResponse.js"

;// CONCATENATED MODULE: ./src/server/apis/runtimeVersionUpdateStatus.ts



async function getRuntimeVersionUpdateStatus({ request, storageClient }) {
    const branchId = request.headers.get("branchId");
    if (!branchId) {
        return ErrorResponse(new Error("Branch ID is required"));
    }
    try {
        const runtimeVersionMetadataJson = await storageClient.getFile({
            key: generateRuntimeVersionUpdateStatusKey(branchId)
        });
        const runtimeVersionMetadata = parseFileAsJson(runtimeVersionMetadataJson);
        return JsonResponse(runtimeVersionMetadata);
    } catch (e) {
        return ErrorResponse(new Error("Failed to get runtime version update status"));
    }
}
async function updateRuntimeVersionUpdateStatus({ request, storageClient }) {
    const branchId = request.headers.get("branchId");
    const updatedRuntimeVersionUpdateStatus = await request.json();
    if (!branchId) {
        return ErrorResponse(new Error("Branch ID is required"));
    }
    const updatedRuntimeVersionUpdateStatusJson = createJsonUint8Array(updatedRuntimeVersionUpdateStatus);
    try {
        await storageClient.uploadFile({
            key: generateRuntimeVersionUpdateStatusKey(branchId),
            file: updatedRuntimeVersionUpdateStatusJson
        });
    } catch (e) {
        return ErrorResponse(new Error("Failed to update runtime version update status"));
    }
}

export { getRuntimeVersionUpdateStatus, updateRuntimeVersionUpdateStatus };

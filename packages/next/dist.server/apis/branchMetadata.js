import { createJsonUint8Array, generateBranchMetadataKey, parseFileAsJson } from "@cloud-push/cloud";
import { JsonResponse } from "../responses/JsonResponse.js";
import { ErrorResponse } from "../responses/ErrorResponse.js";

;// CONCATENATED MODULE: external "@cloud-push/cloud"

;// CONCATENATED MODULE: external "../responses/JsonResponse.js"

;// CONCATENATED MODULE: external "../responses/ErrorResponse.js"

;// CONCATENATED MODULE: ./src/server/apis/branchMetadata.ts



async function getBranchMetadata({ request, storageClient }) {
    const branchId = request.headers.get("branchId");
    if (!branchId) {
        return ErrorResponse(new Error("Branch ID is required"));
    }
    try {
        const branchMetadataJson = await storageClient.getFile({
            key: generateBranchMetadataKey(branchId)
        });
        const branchMetadata = parseFileAsJson(branchMetadataJson);
        return JsonResponse(branchMetadata);
    } catch (e) {
        console.error(e);
        return ErrorResponse(new Error("Failed to get branch metadata"));
    }
}
async function updateBranchMetadata({ request, storageClient }) {
    const branchId = request.headers.get("branchId");
    const updateGroupId = request.headers.get("updateGroupId");
    const branchMetadata = await request.json();
    if (!branchId || !updateGroupId) {
        return ErrorResponse(new Error("Branch ID or Update Group ID is required"));
    }
    await storageClient.uploadFile({
        key: generateBranchMetadataKey(branchId),
        file: createJsonUint8Array(branchMetadata)
    });
    return JsonResponse({
        message: "Branch metadata updated successfully"
    });
}

export { getBranchMetadata, updateBranchMetadata };

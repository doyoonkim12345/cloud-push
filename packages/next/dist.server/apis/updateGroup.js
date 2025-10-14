import { ErrorResponse } from "../responses/ErrorResponse.js";
import { JsonResponse } from "../responses/JsonResponse.js";
import { createJsonUint8Array, generateBranchMetadataKey } from "@cloud-push/cloud";

;// CONCATENATED MODULE: external "../responses/ErrorResponse.js"

;// CONCATENATED MODULE: external "../responses/JsonResponse.js"

;// CONCATENATED MODULE: external "@cloud-push/cloud"

;// CONCATENATED MODULE: ./src/server/apis/updateGroup.ts



async function updateUpdateGroup({ request, storageClient }) {
    const branchId = request.headers.get("branchId");
    const updateGroupId = request.headers.get("updateGroupId");
    const { updateGroup } = await request.json();
    if (!branchId || !updateGroupId) {
        return ErrorResponse(new Error("Branch ID or Update Group ID is required"));
    }
    await storageClient.uploadFile({
        key: generateBranchMetadataKey(branchId),
        file: createJsonUint8Array(updateGroupUpdateStatus)
    });
    return JsonResponse({
        message: "Update Group Update Status updated successfully"
    });
}

export { updateUpdateGroup };

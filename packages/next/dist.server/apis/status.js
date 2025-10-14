import { generateBranchMetadataKey, generateRuntimeVersionUpdateStatusKey, parseFileAsJson } from "@cloud-push/cloud";
import { parseHeaders } from "../utils/parseHeaders.js";
import { ErrorResponse } from "../responses/ErrorResponse.js";
import { StatusResponse } from "../responses/StatusResponse.js";

;// CONCATENATED MODULE: external "@cloud-push/cloud"

;// CONCATENATED MODULE: external "../utils/parseHeaders.js"

;// CONCATENATED MODULE: external "../responses/ErrorResponse.js"

;// CONCATENATED MODULE: external "../responses/StatusResponse.js"

;// CONCATENATED MODULE: ./src/server/apis/status.ts




async function getStatus({ request, storageClient, expoClient }) {
    try {
        const { currentUpdateId, channel, runtimeVersion } = parseHeaders({
            headers: request.headers,
            url: new URL(request.url)
        });
        if (!currentUpdateId || !channel || !runtimeVersion) {
            return ErrorResponse(new Error("Not Enough Params"));
        }
        const branchMappings = await expoClient.fetchBranchesMapping();
        const branchMapping = branchMappings.find((branchMapping)=>branchMapping.channelName === channel);
        if (!branchMapping) {
            return ErrorResponse(new Error("Branch mapping not found"));
        }
        const branchMetadataJson = await storageClient.getFile({
            key: generateBranchMetadataKey(branchMapping.branchId)
        });
        const branchMetadata = parseFileAsJson(branchMetadataJson);
        const updateGroup = branchMetadata.updateGroups.find((updateGroup)=>updateGroup.id === currentUpdateId);
        if (!updateGroup) {
            return ErrorResponse(new Error("Update group not found"));
        }
        const branchUpdateStatusJson = await storageClient.getFile({
            key: generateRuntimeVersionUpdateStatusKey(branchMapping.branchId)
        });
        const branchUpdateStatus = parseFileAsJson(branchUpdateStatusJson);
        const runtimeVersionUpdateStatus = branchUpdateStatus[runtimeVersion] ?? {
            isDeprecated: false,
            isForceUpdateRequired: false
        };
        return StatusResponse({
            status: runtimeVersionUpdateStatus
        });
    } catch (error) {
        return ErrorResponse(error);
    }
}

export { getStatus };

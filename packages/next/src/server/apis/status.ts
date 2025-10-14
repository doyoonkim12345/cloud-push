import type { NextRequest } from "next/server";
import { ExpoClient, generateRuntimeVersionUpdateStatusKey, parseFileAsJson, type RuntimeVersionUpdateStatus, type UpdateStatus, type StorageClient, generateBranchMetadataKey, BranchMetadata } from "@cloud-push/cloud";
import { parseHeaders } from "@/server/utils/parseHeaders";
import { ErrorResponse } from "../responses/ErrorResponse";
import { StatusResponse } from "../responses/StatusResponse";

export async function getStatus({ request, storageClient, expoClient }: { request: NextRequest, storageClient: StorageClient, expoClient: ExpoClient }) {
    try {
        const { currentUpdateId, channel, runtimeVersion } = parseHeaders({
            headers: request.headers,
            url: new URL(request.url),
        });

        if (!currentUpdateId || !channel || !runtimeVersion) {
            return ErrorResponse(new Error("Not Enough Params"));
        }

        const branchMappings = await expoClient.fetchBranchesMapping()
        const branchMapping = branchMappings.find(branchMapping => branchMapping.channelName === channel)
        if (!branchMapping) {
            return ErrorResponse(new Error("Branch mapping not found"));
        }

        const branchMetadataJson = await storageClient.getFile({ key: generateBranchMetadataKey(branchMapping.branchId) })
        const branchMetadata = parseFileAsJson<BranchMetadata>(branchMetadataJson)

        const updateGroup = branchMetadata.updateGroups.find(updateGroup => updateGroup.id === currentUpdateId)

        if (!updateGroup) {
            return ErrorResponse(new Error("Update group not found"));
        }

        const branchUpdateStatusJson = await storageClient.getFile({ key: generateRuntimeVersionUpdateStatusKey(branchMapping.branchId) })
        const branchUpdateStatus = parseFileAsJson<RuntimeVersionUpdateStatus>(branchUpdateStatusJson)

        const runtimeVersionUpdateStatus: UpdateStatus = branchUpdateStatus[runtimeVersion] ?? { isDeprecated: false, isForceUpdateRequired: false }

        return StatusResponse({ status: runtimeVersionUpdateStatus });
    } catch (error) {
        return ErrorResponse(error as Error);
    }
}

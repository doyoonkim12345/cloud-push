import { ExpoClient, generateBranchMetadataKey, generateCloudPath, generateManifestKey, parseFileAsJson } from "@cloud-push/cloud";
import { ErrorResponse } from "../responses/ErrorResponse.js";
import { UpdateResponse } from "../responses/UpdateResponse.js";
import { NoUpdateResponse } from "../responses/NoUpdateResponse.js";
import { parseHeaders } from "../utils/parseHeaders.js";

;// CONCATENATED MODULE: external "@cloud-push/cloud"

;// CONCATENATED MODULE: external "../responses/ErrorResponse.js"

;// CONCATENATED MODULE: external "../responses/UpdateResponse.js"

;// CONCATENATED MODULE: external "../responses/NoUpdateResponse.js"

;// CONCATENATED MODULE: external "../utils/parseHeaders.js"

;// CONCATENATED MODULE: ./src/server/apis/manifest.ts





async function getManifest({ request, storageClient }) {
    try {
        const { currentUpdateId, embeddedUpdateId, channel, platform, protocolVersion, runtimeVersion, expectSignature } = parseHeaders({
            headers: request.headers,
            url: new URL(request.url)
        });
        if (!runtimeVersion || !platform || !protocolVersion || !embeddedUpdateId || !channel) {
            console.log("Not Enough Params", {
                runtimeVersion,
                platform,
                protocolVersion,
                embeddedUpdateId,
                currentUpdateId,
                channel
            });
            return ErrorResponse(new Error("Not Enough Params"));
        }
        const expoAppId = process.env.EXPO_APP_ID;
        const expoToken = process.env.EXPO_TOKEN;
        if (!expoAppId || !expoToken) {
            return ErrorResponse(new Error("Expo App ID or Token is not set"));
        }
        const expoClient = new ExpoClient({
            appId: expoAppId,
            token: expoToken
        });
        const channelMapping = await expoClient.getChannelMapping(channel);
        expoClient.getChannelRolloutState(channel);
        const branchId = channelMapping === null || channelMapping === void 0 ? void 0 : channelMapping.branchMapping.data[0].branchId;
        if (!branchId) {
            return ErrorResponse(new Error("Branch ID not found"));
        }
        const branchMetadataJson = await storageClient.getFile({
            key: generateBranchMetadataKey(branchId)
        });
        const branchMetadata = parseFileAsJson(branchMetadataJson);
        const updateGroupId = branchMetadata.updateGroups[0].id;
        if (updateGroupId) {
            if (updateGroupId !== currentUpdateId) {
                const manifestJson = await storageClient.getFile({
                    key: generateManifestKey(generateCloudPath(branchId, updateGroupId), platform)
                });
                const manifest = parseFileAsJson(manifestJson);
                return UpdateResponse({
                    updateId: updateGroupId,
                    manifest
                });
            }
        }
        return NoUpdateResponse();
    } catch (error) {
        return ErrorResponse(error);
    }
}

export { getManifest };

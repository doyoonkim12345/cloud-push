import type { NextRequest } from "next/server";
import { type BranchMetadata, ExpoClient, generateBranchMetadataKey, generateCloudPath, generateManifestKey, type Manifest, parseFileAsJson, type StorageClient } from "@cloud-push/cloud";
import { ErrorResponse } from "../responses/ErrorResponse";
import { UpdateResponse } from "../responses/UpdateResponse";
import { NoUpdateResponse } from "../responses/NoUpdateResponse";
import { parseHeaders } from "@/server/utils/parseHeaders";

export async function getManifest({ request, storageClient }: { request: NextRequest, storageClient: StorageClient }) {

    try {
        const {
            currentUpdateId,
            embeddedUpdateId,
            channel,
            platform,
            protocolVersion,
            runtimeVersion,
            expectSignature,
        } = parseHeaders({
            headers: request.headers,
            url: new URL(request.url),
        });


        if (
            !runtimeVersion ||
            !platform ||
            !protocolVersion ||
            !embeddedUpdateId ||
            !channel
        ) {
            console.log("Not Enough Params", {
                runtimeVersion,
                platform,
                protocolVersion,
                embeddedUpdateId,
                currentUpdateId,
                channel,
            })
            return ErrorResponse(new Error("Not Enough Params"));
        }

        const expoAppId = process.env.EXPO_APP_ID!;
        const expoToken = process.env.EXPO_TOKEN!;

        if (!expoAppId || !expoToken) {
            return ErrorResponse(new Error("Expo App ID or Token is not set"));
        }

        const expoClient = new ExpoClient({
            appId: expoAppId,
            token: expoToken,
        });

        const channelMapping = await expoClient.getChannelMapping(channel)

        expoClient.getChannelRolloutState(channel)

        const branchId = channelMapping?.branchMapping.data[0].branchId


        if (!branchId) {
            return ErrorResponse(new Error("Branch ID not found"))
        }

        const branchMetadataJson = await storageClient.getFile({ key: generateBranchMetadataKey(branchId) })
        const branchMetadata = parseFileAsJson<BranchMetadata>(branchMetadataJson)

        const updateGroupId: string | undefined = branchMetadata.updateGroups[0].id

        if (updateGroupId) {
            if (updateGroupId !== currentUpdateId) {

                const manifestJson = await storageClient.getFile({
                    key: generateManifestKey(generateCloudPath(branchId, updateGroupId), platform)
                })

                const manifest = parseFileAsJson<Manifest>(manifestJson)

                return UpdateResponse({
                    updateId: updateGroupId,
                    manifest,
                })
            }
        }
        return NoUpdateResponse()
    } catch (error) {
        return ErrorResponse(error as Error);
    }
}

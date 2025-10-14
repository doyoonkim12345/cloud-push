import { generateRuntimeVersionMetadataKey, parseFileAsJson, type StorageClient, type RuntimeVersionMetadata } from "@cloud-push/cloud"
import { JsonResponse } from "../responses/JsonResponse";
import { ErrorResponse } from "../responses/ErrorResponse";

export async function getRuntimeVersionMetadata({ storageClient }: { storageClient: StorageClient }) {
    try {
        const runtimeVersionMetadataJson = await storageClient.getFile({ key: generateRuntimeVersionMetadataKey() })
        const runtimeVersionMetadata = parseFileAsJson<RuntimeVersionMetadata>(runtimeVersionMetadataJson)
        return JsonResponse(runtimeVersionMetadata)
    } catch (e) {
        console.error(e)
        return ErrorResponse(new Error("Failed to get runtime version metadata"))
    }
}
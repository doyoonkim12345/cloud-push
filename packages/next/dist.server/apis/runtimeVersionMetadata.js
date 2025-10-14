import { generateRuntimeVersionMetadataKey, parseFileAsJson } from "@cloud-push/cloud";
import { JsonResponse } from "../responses/JsonResponse.js";
import { ErrorResponse } from "../responses/ErrorResponse.js";

;// CONCATENATED MODULE: external "@cloud-push/cloud"

;// CONCATENATED MODULE: external "../responses/JsonResponse.js"

;// CONCATENATED MODULE: external "../responses/ErrorResponse.js"

;// CONCATENATED MODULE: ./src/server/apis/runtimeVersionMetadata.ts



async function getRuntimeVersionMetadata({ storageClient }) {
    try {
        const runtimeVersionMetadataJson = await storageClient.getFile({
            key: generateRuntimeVersionMetadataKey()
        });
        const runtimeVersionMetadata = parseFileAsJson(runtimeVersionMetadataJson);
        return JsonResponse(runtimeVersionMetadata);
    } catch (e) {
        console.error(e);
        return ErrorResponse(new Error("Failed to get runtime version metadata"));
    }
}

export { getRuntimeVersionMetadata };

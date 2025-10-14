import { createJsonUint8Array, generateRuntimeVersionUpdateStatusKey, parseFileAsJson, type RuntimeVersionUpdateStatus, type StorageClient } from "@cloud-push/cloud";
import type { NextRequest } from "next/server";
import { ErrorResponse } from "../responses/ErrorResponse";
import { JsonResponse } from "../responses/JsonResponse";

export async function getRuntimeVersionUpdateStatus({ request, storageClient }: { request: NextRequest, storageClient: StorageClient }) {

    const branchId = request.headers.get("branchId")

    if (!branchId) {
        return ErrorResponse(new Error("Branch ID is required"))
    }

    try {
        const runtimeVersionMetadataJson = await storageClient.getFile({ key: generateRuntimeVersionUpdateStatusKey(branchId) })
        const runtimeVersionMetadata = parseFileAsJson<RuntimeVersionUpdateStatus>(runtimeVersionMetadataJson)
        return JsonResponse(runtimeVersionMetadata)
    } catch (e) {
        return ErrorResponse(new Error("Failed to get runtime version update status"))
    }
}

export async function updateRuntimeVersionUpdateStatus({ request, storageClient }: { request: NextRequest, storageClient: StorageClient }) {
    const branchId = request.headers.get("branchId")

    const updatedRuntimeVersionUpdateStatus: RuntimeVersionUpdateStatus = await request.json() as RuntimeVersionUpdateStatus

    if (!branchId) {
        return ErrorResponse(new Error("Branch ID is required"))
    }

    const updatedRuntimeVersionUpdateStatusJson = createJsonUint8Array(updatedRuntimeVersionUpdateStatus)

    try {
        await storageClient.uploadFile({ key: generateRuntimeVersionUpdateStatusKey(branchId), file: updatedRuntimeVersionUpdateStatusJson })
    } catch (e) {
        return ErrorResponse(new Error("Failed to update runtime version update status"))
    }
}
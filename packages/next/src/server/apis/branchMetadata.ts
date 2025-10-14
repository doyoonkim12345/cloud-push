import { type BranchMetadata, createJsonUint8Array, generateBranchMetadataKey, parseFileAsJson, type StorageClient } from "@cloud-push/cloud"
import type { NextRequest } from "next/server"
import { JsonResponse } from "../responses/JsonResponse"
import { ErrorResponse } from "../responses/ErrorResponse"

export async function getBranchMetadata({ request, storageClient }: { request: NextRequest, storageClient: StorageClient }) {

    const branchId = request.headers.get("branchId")

    if (!branchId) {
        return ErrorResponse(new Error("Branch ID is required"))
    }

    try {
        const branchMetadataJson = await storageClient.getFile({ key: generateBranchMetadataKey(branchId) })
        const branchMetadata = parseFileAsJson<BranchMetadata>(branchMetadataJson)
        return JsonResponse(branchMetadata)
    } catch (e) {
        console.error(e)
        return ErrorResponse(new Error("Failed to get branch metadata"));
    }
}

export async function updateBranchMetadata({ request, storageClient }: { request: NextRequest, storageClient: StorageClient }) {
    const branchId = request.headers.get("branchId")
    const updateGroupId = request.headers.get("updateGroupId")

    const branchMetadata = await request.json() as BranchMetadata

    if (!branchId || !updateGroupId) {
        return ErrorResponse(new Error("Branch ID or Update Group ID is required"))
    }

    await storageClient.uploadFile({ key: generateBranchMetadataKey(branchId), file: createJsonUint8Array(branchMetadata) })
    return JsonResponse({ message: "Branch metadata updated successfully" })


}
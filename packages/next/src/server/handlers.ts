import type { NextRequest } from "next/server";
import { getBranchMetadata, updateBranchMetadata } from "./apis/branchMetadata";
import { ErrorResponse } from "./responses/ErrorResponse";
import { getBranches } from "./apis/branches";
import { getManifest } from "./apis/manifest";
import { getRuntimeVersionMetadata } from "./apis/runtimeVersionMetadata";
import { getRuntimeVersionUpdateStatus, updateRuntimeVersionUpdateStatus } from "./apis/runtimeVersionUpdateStatus";
import { getStatus } from "./apis/status";
import type { ExpoClient, StorageClient } from "@cloud-push/cloud";

const GET = async ({ request, params, storageClient, expoClient }: { request: NextRequest, params: { params: Promise<{ cloudPush: string[] }> }, storageClient: StorageClient, expoClient: ExpoClient }) => {
    const { cloudPush: [path] } = await params.params

    switch (path.trim()) {
        case 'manifest':
            return getManifest({ request, storageClient })
        case 'status':
            return getStatus({ request, storageClient, expoClient })
        case 'branches':
            return getBranches({ expoClient })
        case 'branchMetadata':
            return getBranchMetadata({ request, storageClient })
        case 'runtimeVersionMetadata':
            return getRuntimeVersionMetadata({ storageClient })
        case 'runtimeVersionUpdateStatus':
            return getRuntimeVersionUpdateStatus({ request, storageClient })
        default:
            return ErrorResponse(new Error("Not Found " + path))
    }
}

const POST = async ({ request, params, storageClient }: { request: NextRequest, params: { params: Promise<{ cloudPush: string[] }> }, storageClient: StorageClient }) => {
    const { cloudPush: [path] } = await params.params
    switch (path) {
        case 'runtimeVersionUpdateStatus':
            return updateRuntimeVersionUpdateStatus({ request, storageClient })
        case 'branchMetadata':
            return updateBranchMetadata({ request, storageClient })
        default:
            return ErrorResponse(new Error("Not Found"))
    }

}

export const handlers = ({ storageClient, expoClient }: { storageClient: StorageClient, expoClient: ExpoClient }) => ({
    GET: (request: NextRequest, params: { params: Promise<{ cloudPush: string[] }> }) => GET({ request, storageClient, expoClient, params }),
    POST: (request: NextRequest, params: { params: Promise<{ cloudPush: string[] }> }) => POST({ request, storageClient, params }),
})

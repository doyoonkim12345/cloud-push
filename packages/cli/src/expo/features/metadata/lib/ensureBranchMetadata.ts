import type { StorageClient } from "@cloud-push/cloud";
import type { BranchMetadata } from "../types";
import { parseFileAsJson } from "@/lib/parseFileAsJson";
import path from "node:path";

export async function ensureBranchMetadata({
    storageClient,
    branchId,
}: {
    storageClient: StorageClient,
    branchId: string,
}): Promise<BranchMetadata> {

    const key = path.join(branchId, "metadata.json")

    let metadata: BranchMetadata

    try {
        const metadataBuffer = await storageClient.getFile({ key })
        metadata = parseFileAsJson<BranchMetadata>(metadataBuffer)
    } catch (e) {
        metadata = {
            pushes: [],
        }
    }

    return metadata
}
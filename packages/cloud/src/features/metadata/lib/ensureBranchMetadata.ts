import type { StorageClient } from "@/core";
import type { BranchMetadata } from "../types";
import { generateBranchMetadataKey } from "@/constants";
import { parseFileAsJson } from "@/utils";

export async function ensureBranchMetadata({
    storageClient,
    branchId,
}: {
    storageClient: StorageClient,
    branchId: string,
}): Promise<BranchMetadata> {

    const key = generateBranchMetadataKey(branchId)

    let metadata: BranchMetadata

    try {
        const metadataBuffer = await storageClient.getFile({ key })
        metadata = parseFileAsJson<BranchMetadata>(metadataBuffer)
    } catch (e) {
        metadata = {
            updateGroups: [],
        }
    }

    return metadata
}
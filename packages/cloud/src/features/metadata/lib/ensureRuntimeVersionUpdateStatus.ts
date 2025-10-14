import type { StorageClient } from "@/core";
import type { RuntimeVersionUpdateStatus } from "../types";
import { generateRuntimeVersionUpdateStatusKey } from "@/constants";
import { parseFileAsJson } from "@/utils";

export async function ensureRuntimeVersionUpdateStatus({ storageClient, branchId }: { storageClient: StorageClient, branchId: string }): Promise<RuntimeVersionUpdateStatus> {
    try {
        const branchMetadataJson = await storageClient.getFile({ key: generateRuntimeVersionUpdateStatusKey(branchId) })
        return parseFileAsJson<RuntimeVersionUpdateStatus>(branchMetadataJson)
    } catch (e) {
        return {}
    }
}
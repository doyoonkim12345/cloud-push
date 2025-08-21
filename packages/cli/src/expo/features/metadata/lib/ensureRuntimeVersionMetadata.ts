import * as path from "node:path";
import type { RuntimeVersionMetadata } from "../types";
import { parseFileAsJson } from "@/lib";
import type { StorageClient } from "@cloud-push/cloud";

export const ensureRuntimeVersionMetadata = async ({ storageClient, runtimeVersion }: { storageClient: StorageClient, runtimeVersion: string }): Promise<RuntimeVersionMetadata> => {
    try {
        const branchMetadataJson = await storageClient.getFile({ key: path.join(runtimeVersion, "metadata.json") })

        return parseFileAsJson<RuntimeVersionMetadata>(branchMetadataJson)
    } catch (e) {
        return {
            isDeprecated: false,
        }
    }
}
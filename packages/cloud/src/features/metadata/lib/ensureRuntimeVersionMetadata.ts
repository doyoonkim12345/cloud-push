import type { StorageClient } from "@/core"
import type { RuntimeVersionMetadata } from "../types"
import { generateRuntimeVersionMetadataKey } from "@/constants"
import { parseFileAsJson } from "@/utils"

export const ensureRuntimeVersionMetadata = async ({ storageClient, }: { storageClient: StorageClient, }): Promise<RuntimeVersionMetadata> => {
    try {
        const branchMetadataJson = await storageClient.getFile({ key: generateRuntimeVersionMetadataKey() })
        return parseFileAsJson<RuntimeVersionMetadata>(branchMetadataJson)
    } catch (e) {
        return {
            runtimeVersions: []
        }
    }
}
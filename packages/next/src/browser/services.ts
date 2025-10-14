import { updateBranchMetadata } from "@/server/apis/branchMetadata"
import type { BranchMetadata, ExpoBranch, RuntimeVersionMetadata, RuntimeVersionUpdateStatus, UpdateGroup, } from "@cloud-push/cloud"

export const services = {
    getBranches: async (): Promise<ExpoBranch[]> => {
        const branches = await fetch("/api/updates/branches")
        return branches.json() as Promise<ExpoBranch[]>
    },
    getBranchMetadata: async (branchId: string): Promise<BranchMetadata> => {
        const headers = new Headers()
        headers.append("branchId", branchId)
        const branchMetadata = await fetch(`/api/updates/branchMetadata`, { headers })
        return branchMetadata.json() as Promise<BranchMetadata>
    },
    getRuntimeVersionMetadata: async (): Promise<RuntimeVersionMetadata> => {
        const runtimeVersionMetadata = await fetch("/api/updates/runtimeVersionMetadata")
        return runtimeVersionMetadata.json() as Promise<RuntimeVersionMetadata>
    },
    getRuntimeVersionUpdateStatus: async (branchId: string): Promise<RuntimeVersionUpdateStatus> => {
        const headers = new Headers()
        headers.append("branchId", branchId)
        const runtimeVersionUpdateStatus = await fetch(`/api/updates/runtimeVersionUpdateStatus`, { headers })
        return runtimeVersionUpdateStatus.json() as Promise<RuntimeVersionUpdateStatus>
    },
    updateRuntimeVersionUpdateStatus: async (branchId: string, runtimeVersionUpdateStatus: RuntimeVersionUpdateStatus): Promise<void> => {
        const headers = new Headers()
        headers.append("branchId", branchId)
        await fetch(`/api/updates/runtimeVersionUpdateStatus`, { headers, method: "POST", body: JSON.stringify(runtimeVersionUpdateStatus) })
    },
    updateBranchMetadata: async (branchId: string, updateGroupId: string, branchMetadata: BranchMetadata): Promise<void> => {
        const headers = new Headers()
        headers.append("branchId", branchId)
        headers.append("updateGroupId", updateGroupId)
        await fetch(`/api/updates/branchMetadata`, { headers, method: "POST", body: JSON.stringify(branchMetadata) })
    }
}

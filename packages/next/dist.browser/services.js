
;// CONCATENATED MODULE: ./src/browser/services.ts
const services = {
    getBranches: async ()=>{
        const branches = await fetch("/api/updates/branches");
        return branches.json();
    },
    getBranchMetadata: async (branchId)=>{
        const headers = new Headers();
        headers.append("branchId", branchId);
        const branchMetadata = await fetch(`/api/updates/branchMetadata`, {
            headers
        });
        return branchMetadata.json();
    },
    getRuntimeVersionMetadata: async ()=>{
        const runtimeVersionMetadata = await fetch("/api/updates/runtimeVersionMetadata");
        return runtimeVersionMetadata.json();
    },
    getRuntimeVersionUpdateStatus: async (branchId)=>{
        const headers = new Headers();
        headers.append("branchId", branchId);
        const runtimeVersionUpdateStatus = await fetch(`/api/updates/runtimeVersionUpdateStatus`, {
            headers
        });
        return runtimeVersionUpdateStatus.json();
    },
    updateRuntimeVersionUpdateStatus: async (branchId, runtimeVersionUpdateStatus)=>{
        const headers = new Headers();
        headers.append("branchId", branchId);
        await fetch(`/api/updates/runtimeVersionUpdateStatus`, {
            headers,
            method: "POST",
            body: JSON.stringify(runtimeVersionUpdateStatus)
        });
    },
    updateBranchMetadata: async (branchId, updateGroupId, branchMetadata)=>{
        const headers = new Headers();
        headers.append("branchId", branchId);
        headers.append("updateGroupId", updateGroupId);
        await fetch(`/api/updates/branchMetadata`, {
            headers,
            method: "POST",
            body: JSON.stringify(branchMetadata)
        });
    }
};

export { services };

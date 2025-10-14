import { type StorageClient } from "@cloud-push/cloud";
import type { NextRequest } from "next/server";
export declare function getBranchMetadata({ request, storageClient }: {
    request: NextRequest;
    storageClient: StorageClient;
}): Promise<Response>;
export declare function updateBranchMetadata({ request, storageClient }: {
    request: NextRequest;
    storageClient: StorageClient;
}): Promise<Response>;
//# sourceMappingURL=branchMetadata.d.ts.map
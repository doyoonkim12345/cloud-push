import { type StorageClient } from "@cloud-push/cloud";
import type { NextRequest } from "next/server";
export declare function getRuntimeVersionUpdateStatus({ request, storageClient }: {
    request: NextRequest;
    storageClient: StorageClient;
}): Promise<Response>;
export declare function updateRuntimeVersionUpdateStatus({ request, storageClient }: {
    request: NextRequest;
    storageClient: StorageClient;
}): Promise<Response | undefined>;
//# sourceMappingURL=runtimeVersionUpdateStatus.d.ts.map
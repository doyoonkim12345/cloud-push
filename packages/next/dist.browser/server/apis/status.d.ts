import type { NextRequest } from "next/server";
import { ExpoClient, type StorageClient } from "@cloud-push/cloud";
export declare function getStatus({ request, storageClient, expoClient }: {
    request: NextRequest;
    storageClient: StorageClient;
    expoClient: ExpoClient;
}): Promise<Response>;
//# sourceMappingURL=status.d.ts.map
import type { NextRequest } from "next/server";
import { type StorageClient } from "@cloud-push/cloud";
export declare function getManifest({ request, storageClient }: {
    request: NextRequest;
    storageClient: StorageClient;
}): Promise<Response>;
//# sourceMappingURL=manifest.d.ts.map
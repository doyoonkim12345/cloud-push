import type { NextRequest } from "next/server";
import type { ExpoClient, StorageClient } from "@cloud-push/cloud";
export declare const handlers: ({ storageClient, expoClient }: {
    storageClient: StorageClient;
    expoClient: ExpoClient;
}) => {
    GET: (request: NextRequest, params: {
        params: Promise<{
            cloudPush: string[];
        }>;
    }) => Promise<Response>;
    POST: (request: NextRequest, params: {
        params: Promise<{
            cloudPush: string[];
        }>;
    }) => Promise<Response | undefined>;
};
//# sourceMappingURL=handlers.d.ts.map
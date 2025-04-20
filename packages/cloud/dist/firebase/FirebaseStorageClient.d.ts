import { StorageClient } from "../core/StorageClient";
import type { Agent } from "node:https";
interface FirebaseStorageClientProps {
    credential: string;
    httpAgent?: Agent;
    bucketName?: string;
}
export declare class FirebaseStorageClient extends StorageClient {
    private bucket;
    constructor({ credential, httpAgent, bucketName, }: FirebaseStorageClientProps);
    getFile: ({ key }: {
        key: string;
    }) => Promise<Buffer<ArrayBuffer>>;
    getFileSignedUrl: ({ key, expiresIn, }: {
        key: string;
        expiresIn?: number;
    }) => Promise<string>;
    uploadFile: ({ key, file, contentType, }: {
        key: string;
        file: Buffer;
        contentType?: string;
    }) => Promise<void>;
    uploadLocalFile: ({ fileName, filePath, }: {
        fileName: string;
        filePath: string;
    }) => Promise<string>;
    uploadDirectory: ({ cloudPath, directoryPath, }: {
        cloudPath: string;
        directoryPath: string;
    }) => Promise<void>;
}
export {};
//# sourceMappingURL=FirebaseStorageClient.d.ts.map
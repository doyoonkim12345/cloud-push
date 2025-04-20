import { StorageClient } from "../core/StorageClient";
interface CloudflareConfig {
    accountId: string;
    apiToken: string;
    bucket: string;
}
export declare class CloudflareR2StorageClient extends StorageClient {
    private config;
    private baseUrl;
    constructor(config: CloudflareConfig);
    private fetchWithAuth;
    getFile: ({ key }: {
        key: string;
    }) => Promise<Buffer<ArrayBuffer>>;
    getFileSignedUrl: ({ key, expiresIn, }: {
        key: string;
        expiresIn?: number;
    }) => Promise<string>;
    uploadFile: ({ key, file, }: {
        key: string;
        file: Buffer;
    }) => Promise<void>;
    protected readLocalFile(filePath: string): Buffer;
    protected getFileExtension(filePath: string): string;
    protected isDirectory(dirPath: string): boolean;
    protected readDirectory(dirPath: string): string[];
    uploadLocalFile: ({ filePath, fileName, }: {
        filePath: string;
        fileName: string;
    }) => Promise<string | undefined>;
    uploadDirectory: ({ cloudPath, directoryPath, }: {
        cloudPath: string;
        directoryPath: string;
    }) => Promise<void>;
}
export {};
//# sourceMappingURL=CloudflareR2StorageClient.d.ts.map
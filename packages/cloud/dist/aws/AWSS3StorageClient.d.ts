import { StorageClient } from "../core/StorageClient";
interface AWSS3ClientProps {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
}
export declare class AWSS3StorageClient extends StorageClient {
    private client;
    private bucketName;
    constructor({ region, accessKeyId, secretAccessKey, bucketName, }: AWSS3ClientProps);
    getFile: ({ key }: {
        key: string;
    }) => Promise<Buffer>;
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
    }) => Promise<string | undefined>;
    uploadDirectory: ({ cloudPath, directoryPath, }: {
        cloudPath: string;
        directoryPath: string;
    }) => Promise<void>;
}
export {};
//# sourceMappingURL=AWSS3StorageClient.d.ts.map
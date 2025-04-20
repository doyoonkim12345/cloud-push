import { StorageClient } from "../core/StorageClient";
import { type SupabaseClient as OriginalSupabaseClient } from "@supabase/supabase-js";
interface SupabaseClientProps {
    supabaseUrl: string;
    supabaseKey: string;
    bucketName: string;
}
export declare class SupabaseStorageClient extends StorageClient {
    client: OriginalSupabaseClient;
    bucketName: string;
    constructor({ supabaseUrl, supabaseKey, bucketName }: SupabaseClientProps);
    getFile: ({ key, mimeType }: {
        key: string;
        mimeType?: string;
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
    uploadLocalFile: ({ filePath, fileName, }: {
        filePath: string;
        fileName: string;
    }) => Promise<string>;
    uploadDirectory: ({ cloudPath, directoryPath, }: {
        cloudPath: string;
        directoryPath: string;
    }) => Promise<void>;
    private getContentType;
    deleteFile: (key: string) => Promise<void>;
    deleteFiles: (keys: string[]) => Promise<void>;
    copyFile: (fromKey: string, toKey: string) => Promise<void>;
    moveFile: (fromKey: string, toKey: string) => Promise<void>;
}
export {};
//# sourceMappingURL=SupabaseStorageClient.d.ts.map
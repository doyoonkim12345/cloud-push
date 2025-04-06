import { S3Client } from "@aws-sdk/client-s3";
export interface uploadDirectoryProps {
    directoryPath: string;
    s3Path: string;
    bucketName: string;
}
export declare function uploadDirectory(s3Client: S3Client, { bucketName, directoryPath, s3Path }: uploadDirectoryProps): Promise<void>;
//# sourceMappingURL=uploadDirectory.d.ts.map
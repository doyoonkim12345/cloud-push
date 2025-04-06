import { S3Client } from "@aws-sdk/client-s3";
export type S3Params = {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
};
export interface UploadLocalFileProps {
    filePath: string;
    fileName: string;
    bucketName: string;
}
export declare function uploadLocalFile(client: S3Client, { bucketName, fileName, filePath }: UploadLocalFileProps): Promise<string | undefined>;
//# sourceMappingURL=uploadLocalFile.d.ts.map
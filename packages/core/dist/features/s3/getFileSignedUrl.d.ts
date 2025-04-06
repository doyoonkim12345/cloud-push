import { S3Client } from "@aws-sdk/client-s3";
export interface GetFileSignedUrlProps {
    bucketName: string;
    key: string;
    expiresIn?: number;
}
export declare function getFileSignedUrl(s3Client: S3Client, { bucketName, expiresIn, key }: GetFileSignedUrlProps): Promise<string>;
//# sourceMappingURL=getFileSignedUrl.d.ts.map
import { S3Client } from "@aws-sdk/client-s3";
export interface GetFileProps {
    key: string;
    bucketName: string;
    mimeType?: string;
}
export default function getFile(s3Client: S3Client, { bucketName, mimeType, key }: GetFileProps): Promise<File>;
//# sourceMappingURL=getFile.d.ts.map
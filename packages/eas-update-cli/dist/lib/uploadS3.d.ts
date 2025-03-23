export type S3Params = {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
};
export default function uploadS3(filePath: string, fileName: string, params: S3Params): Promise<string | undefined>;
//# sourceMappingURL=uploadS3.d.ts.map
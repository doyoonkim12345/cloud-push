import { S3Client } from "@aws-sdk/client-s3";
export interface ListFoldersWithPaginationProps {
    bucketName: string;
    prefix: string;
    continuationToken?: string | undefined;
    pageSize?: number;
}
export default function listFoldersWithPagination(client: S3Client, { bucketName, prefix, continuationToken, pageSize, }: ListFoldersWithPaginationProps): Promise<{
    allFolders: string[];
    nextContinuationToken: string | undefined;
}>;
//# sourceMappingURL=listFoldersWithPagination.d.ts.map
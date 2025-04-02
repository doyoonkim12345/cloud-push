import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

export interface ListFoldersWithPaginationProps {
  bucketName: string;
  prefix: string;
  continuationToken?: string | undefined;
  pageSize?: number;
}

export default async function listFoldersWithPagination(
  client: S3Client,
  {
    bucketName,
    prefix,
    continuationToken,
    pageSize = 20,
  }: ListFoldersWithPaginationProps
) {
  const allFolders: string[] = [];

  // S3 객체 목록 가져오기
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
    MaxKeys: pageSize,
    Delimiter: "/",
    ContinuationToken: continuationToken,
  });

  const response = await client.send(command);

  // CommonPrefixes에서 폴더 목록 추출
  if (response.CommonPrefixes) {
    const folders = response.CommonPrefixes.map(
      (prefixObj) => prefixObj.Prefix || ""
    );
    allFolders.push(...folders);
  }

  return {
    allFolders,
    nextContinuationToken: response.NextContinuationToken,
  };
}

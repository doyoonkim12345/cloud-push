import { Environment } from "@/features/updates/types";
import { listFoldersWithPagination } from "@/features/api/client";

export async function getS3LastestBundlePath({
  runtimeVersion,
  environment,
}: {
  runtimeVersion: string;
  environment: Environment;
}) {
  const path = `/${runtimeVersion}/${environment}/`;

  const response = await listFoldersWithPagination({
    bucketName: process.env.AWS_BUCKET_NAME!,
    prefix: path,
    pageSize: 1,
  });

  const folder = response.allFolders[0];

  if (!folder) {
    throw new Error("Failed to get lastest file");
  }

  return folder;
}

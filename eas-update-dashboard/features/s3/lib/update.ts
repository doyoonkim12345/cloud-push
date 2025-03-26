import { Environment } from "@/features/updates/types";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getS3LastestBundle({
  runtimeVersion,
  environment,
}: {
  runtimeVersion: string;
  environment: Environment;
}) {
  const path = `/${runtimeVersion}/${environment}/`;

  console.log(path);

  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
    Delimiter: path,
  });
  const response = await s3.send(command);

  if (!response.Contents || response.Contents.length === 0) {
    throw new Error("No Bundles");
  }

  // 파일 이름이 시간순이라면 마지막 객체가 최신 파일
  const latestFile = response.Contents[response.Contents.length - 1];
  if (!latestFile.Key) {
    throw new Error("Failed to get lastest file");
  }

  return latestFile.Key;
}

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export interface GetFileSignedUrlProps {
  bucketName: string;
  key: string;
  expiresIn?: number;
}

export async function getFileSignedUrl(
  s3Client: S3Client,
  { bucketName, expiresIn, key }: GetFileSignedUrlProps
) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return url;
  } catch (error) {
    console.error("Error generating GET Presigned URL:", error);
    throw error;
  }
}

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export interface GetFileProps {
  key: string;
  bucketName: string;
  mimeType?: string; // Made optional
}

export default async function getFile(
  s3Client: S3Client,
  { bucketName, mimeType = "application/octet-stream", key }: GetFileProps
): Promise<File> {
  try {
    // GetObject command creation
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    // Fetch the object from S3
    const response = await s3Client.send(command);

    // Verify response body
    if (!response.Body) {
      throw new Error("File content is empty");
    }

    // Convert Node.js Readable stream to a Buffer
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    // Extract the file name (take only the last part of the key path)
    const fileName = key.split("/").pop() || "downloaded-file";

    // Use ContentType from response or fallback to provided MIME type
    const contentType = response.ContentType || mimeType;

    // Convert Buffer to Blob
    const blob = new Blob([buffer], { type: contentType });

    // Convert Blob to File
    const file = new File([blob], fileName, {
      type: contentType,
      lastModified: response.LastModified
        ? response.LastModified.getTime()
        : Date.now(),
    });

    return file;
  } catch (error) {
    throw error;
  }
}

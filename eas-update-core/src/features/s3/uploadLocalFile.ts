import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createReadStream } from "fs";

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

export async function uploadLocalFile(
  client: S3Client,
  { bucketName, fileName, filePath }: UploadLocalFileProps
): Promise<string | undefined> {
  // 파일 스트림 생성
  const fileStream = createReadStream(filePath);

  // 업로드 객체 생성
  const upload = new Upload({
    client,
    params: {
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
    },
  });

  // 업로드 실행
  const result = await upload.done();

  return result.Location;
}

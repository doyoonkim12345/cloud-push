import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createReadStream } from "fs";
import * as prompts from "@clack/prompts";

export type S3Params = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
};

export default async function uploadS3(
  filePath: string,
  fileName: string,
  params: S3Params
): Promise<string | undefined> {
  const { bucketName, accessKeyId, region, secretAccessKey } = params;
  try {
    // S3 클라이언트 생성
    const client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

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

    // 진행 상황 이벤트 리스너 추가
    upload.on("httpUploadProgress", (progress) => {
      const loaded = progress.loaded || 0;
      const total = progress.total || 0;

      if (total > 0) {
        const percentComplete = Math.round((loaded / total) * 100);
        prompts.log.message(`Uploading : ${percentComplete}%`);
      } else {
        prompts.log.message(`Uploaded: ${loaded}`);
      }
    });

    // 업로드 실행
    const result = await upload.done();

    return result.Location;
  } catch (error) {
    throw error;
  }
}

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export interface UploadFileProps {
  file: File;
  bucketName: string;
  key: string;
}

/**
 * File 객체를 S3에 업로드하는 함수
 * @param file File 객체
 * @param bucketName S3 버킷 이름
 * @param key S3에 저장될 객체 키(경로 포함 파일명)
 * @returns 업로드 성공 여부를 담은 Promise
 */
export async function uploadFile(
  s3Client: S3Client,
  { file, bucketName, key }: UploadFileProps
) {
  // const spinner = prompts.spinner();
  // spinner.start("Preparing file upload...");

  // try {
  // File 객체에서 바이너리 데이터 얻기
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // S3 업로드 파라미터 구성
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.type || "application/octet-stream",
  };

  // 업로드 명령 실행
  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  // spinner.stop("✅ Uploading bundle cursor completed successfully!");
  // return true;
  // } catch (error) {
  // spinner.stop(
  //   `❌ Uploading bundle cursor failed: ${(error as Error).message}`
  // );
  // return false;
  // }
}

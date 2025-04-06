import { S3Client } from "@aws-sdk/client-s3";
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
export declare function uploadFile(s3Client: S3Client, { file, bucketName, key }: UploadFileProps): Promise<void>;
//# sourceMappingURL=uploadFile.d.ts.map
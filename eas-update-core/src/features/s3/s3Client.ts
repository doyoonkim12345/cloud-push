import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import getFile, { GetFileProps } from "./getFile";
import listFoldersWithPagination, {
  ListFoldersWithPaginationProps,
} from "./listFoldersWithPagination";
import { uploadDirectory, uploadDirectoryProps } from "./uploadDirectory";
import { uploadFile, UploadFileProps } from "./uploadFile";
import { uploadLocalFile, UploadLocalFileProps } from "./uploadLocalFile";
import { getFileSignedUrl, GetFileSignedUrlProps } from "./getFileSignedUrl";

const s3Client = (config: S3ClientConfig) => {
  const s3Client = new S3Client(config);

  return {
    getFile: (props: GetFileProps) => getFile(s3Client, props),
    listFoldersWithPagination: (props: ListFoldersWithPaginationProps) =>
      listFoldersWithPagination(s3Client, props),
    uploadDirectory: (props: uploadDirectoryProps) =>
      uploadDirectory(s3Client, props),
    uploadFile: (props: UploadFileProps) => uploadFile(s3Client, props),
    uploadLocalFile: (props: UploadLocalFileProps) =>
      uploadLocalFile(s3Client, props),
    getFileSignedUrl: (props: GetFileSignedUrlProps) =>
      getFileSignedUrl(s3Client, props),
  };
};

export default s3Client;

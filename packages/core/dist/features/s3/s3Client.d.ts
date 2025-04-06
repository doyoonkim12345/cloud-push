import { S3ClientConfig } from "@aws-sdk/client-s3";
import { GetFileProps } from "./getFile";
import { ListFoldersWithPaginationProps } from "./listFoldersWithPagination";
import { uploadDirectoryProps } from "./uploadDirectory";
import { UploadFileProps } from "./uploadFile";
import { UploadLocalFileProps } from "./uploadLocalFile";
import { GetFileSignedUrlProps } from "./getFileSignedUrl";
declare const s3Client: (config: S3ClientConfig) => {
    getFile: (props: GetFileProps) => Promise<File>;
    listFoldersWithPagination: (props: ListFoldersWithPaginationProps) => Promise<{
        allFolders: string[];
        nextContinuationToken: string | undefined;
    }>;
    uploadDirectory: (props: uploadDirectoryProps) => Promise<void>;
    uploadFile: (props: UploadFileProps) => Promise<void>;
    uploadLocalFile: (props: UploadLocalFileProps) => Promise<string | undefined>;
    getFileSignedUrl: (props: GetFileSignedUrlProps) => Promise<string>;
};
export default s3Client;
//# sourceMappingURL=s3Client.d.ts.map
import * as __WEBPACK_EXTERNAL_MODULE__aws_sdk_client_s3_241e987a__ from "@aws-sdk/client-s3";
import * as __WEBPACK_EXTERNAL_MODULE_fs__ from "fs";
import * as __WEBPACK_EXTERNAL_MODULE_path__ from "path";
import * as __WEBPACK_EXTERNAL_MODULE__aws_sdk_lib_storage_3664e495__ from "@aws-sdk/lib-storage";
import * as __WEBPACK_EXTERNAL_MODULE__aws_sdk_s3_request_presigner_ed243ccb__ from "@aws-sdk/s3-request-presigner";
async function getFile(s3Client, { bucketName, mimeType = "application/octet-stream", key }) {
    try {
        const command = new __WEBPACK_EXTERNAL_MODULE__aws_sdk_client_s3_241e987a__.GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });
        const response = await s3Client.send(command);
        if (!response.Body) throw new Error("File content is empty");
        const stream = response.Body;
        const chunks = [];
        for await (const chunk of stream)chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const buffer = Buffer.concat(chunks);
        const fileName = key.split("/").pop() || "downloaded-file";
        const contentType = response.ContentType || mimeType;
        const blob = new Blob([
            buffer
        ], {
            type: contentType
        });
        const file = new File([
            blob
        ], fileName, {
            type: contentType,
            lastModified: response.LastModified ? response.LastModified.getTime() : Date.now()
        });
        return file;
    } catch (error) {
        throw error;
    }
}
async function listFoldersWithPagination(client, { bucketName, prefix, continuationToken, pageSize = 20 }) {
    const allFolders = [];
    const command = new __WEBPACK_EXTERNAL_MODULE__aws_sdk_client_s3_241e987a__.ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        MaxKeys: pageSize,
        Delimiter: "/",
        ContinuationToken: continuationToken
    });
    const response = await client.send(command);
    if (response.CommonPrefixes) {
        const folders = response.CommonPrefixes.map((prefixObj)=>prefixObj.Prefix || "");
        allFolders.push(...folders);
    }
    return {
        allFolders,
        nextContinuationToken: response.NextContinuationToken
    };
}
async function uploadLocalFile(client, { bucketName, fileName, filePath }) {
    const fileStream = (0, __WEBPACK_EXTERNAL_MODULE_fs__.createReadStream)(filePath);
    const upload = new __WEBPACK_EXTERNAL_MODULE__aws_sdk_lib_storage_3664e495__.Upload({
        client,
        params: {
            Bucket: bucketName,
            Key: fileName,
            Body: fileStream
        }
    });
    const result = await upload.done();
    return result.Location;
}
async function uploadDirectory(s3Client, { bucketName, directoryPath, s3Path }) {
    const uploadedFiles = {};
    const stats = __WEBPACK_EXTERNAL_MODULE_fs__.statSync(directoryPath);
    if (!stats.isDirectory()) throw new Error(`${directoryPath} is not a directory.`);
    const allFiles = [];
    function collectFiles(dir, base = "") {
        const files = __WEBPACK_EXTERNAL_MODULE_fs__.readdirSync(dir);
        for (const file of files){
            const filePath = __WEBPACK_EXTERNAL_MODULE_path__.join(dir, file);
            const relPath = __WEBPACK_EXTERNAL_MODULE_path__.join(base, file);
            const fileStats = __WEBPACK_EXTERNAL_MODULE_fs__.statSync(filePath);
            if (fileStats.isDirectory()) collectFiles(filePath, relPath);
            else allFiles.push({
                path: filePath,
                relativePath: relPath
            });
        }
    }
    collectFiles(directoryPath);
    for(let i = 0; i < allFiles.length; i++){
        const { path: filePath, relativePath } = allFiles[i];
        const s3Key = __WEBPACK_EXTERNAL_MODULE_path__.join(s3Path, relativePath).replace(/\\/g, "/");
        const location = await uploadLocalFile(s3Client, {
            filePath,
            fileName: s3Key,
            bucketName
        });
        if (location) uploadedFiles[relativePath] = location;
    }
}
async function uploadFile(s3Client, { file, bucketName, key }) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream"
    };
    const command = new __WEBPACK_EXTERNAL_MODULE__aws_sdk_client_s3_241e987a__.PutObjectCommand(params);
    await s3Client.send(command);
}
async function getFileSignedUrl(s3Client, { bucketName, expiresIn, key }) {
    try {
        const command = new __WEBPACK_EXTERNAL_MODULE__aws_sdk_client_s3_241e987a__.GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });
        const url = await (0, __WEBPACK_EXTERNAL_MODULE__aws_sdk_s3_request_presigner_ed243ccb__.getSignedUrl)(s3Client, command, {
            expiresIn
        });
        return url;
    } catch (error) {
        console.error("Error generating GET Presigned URL:", error);
        throw error;
    }
}
const s3Client_s3Client = (config)=>{
    const s3Client = new __WEBPACK_EXTERNAL_MODULE__aws_sdk_client_s3_241e987a__.S3Client(config);
    return {
        getFile: (props)=>getFile(s3Client, props),
        listFoldersWithPagination: (props)=>listFoldersWithPagination(s3Client, props),
        uploadDirectory: (props)=>uploadDirectory(s3Client, props),
        uploadFile: (props)=>uploadFile(s3Client, props),
        uploadLocalFile: (props)=>uploadLocalFile(s3Client, props),
        getFileSignedUrl: (props)=>getFileSignedUrl(s3Client, props)
    };
};
const s3_s3Client = s3Client_s3Client;
const s3_rslib_entry_ = s3_s3Client;
export { s3_rslib_entry_ as default };

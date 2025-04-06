"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = (exports1, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    default: ()=>s3_rslib_entry_
});
const client_s3_namespaceObject = require("@aws-sdk/client-s3");
async function getFile(s3Client, { bucketName, mimeType = "application/octet-stream", key }) {
    try {
        const command = new client_s3_namespaceObject.GetObjectCommand({
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
    const command = new client_s3_namespaceObject.ListObjectsV2Command({
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
const external_fs_namespaceObject = require("fs");
const external_path_namespaceObject = require("path");
const lib_storage_namespaceObject = require("@aws-sdk/lib-storage");
async function uploadLocalFile(client, { bucketName, fileName, filePath }) {
    const fileStream = (0, external_fs_namespaceObject.createReadStream)(filePath);
    const upload = new lib_storage_namespaceObject.Upload({
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
    const stats = external_fs_namespaceObject.statSync(directoryPath);
    if (!stats.isDirectory()) throw new Error(`${directoryPath} is not a directory.`);
    const allFiles = [];
    function collectFiles(dir, base = "") {
        const files = external_fs_namespaceObject.readdirSync(dir);
        for (const file of files){
            const filePath = external_path_namespaceObject.join(dir, file);
            const relPath = external_path_namespaceObject.join(base, file);
            const fileStats = external_fs_namespaceObject.statSync(filePath);
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
        const s3Key = external_path_namespaceObject.join(s3Path, relativePath).replace(/\\/g, "/");
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
    const command = new client_s3_namespaceObject.PutObjectCommand(params);
    await s3Client.send(command);
}
const s3_request_presigner_namespaceObject = require("@aws-sdk/s3-request-presigner");
async function getFileSignedUrl(s3Client, { bucketName, expiresIn, key }) {
    try {
        const command = new client_s3_namespaceObject.GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });
        const url = await (0, s3_request_presigner_namespaceObject.getSignedUrl)(s3Client, command, {
            expiresIn
        });
        return url;
    } catch (error) {
        console.error("Error generating GET Presigned URL:", error);
        throw error;
    }
}
const s3Client_s3Client = (config)=>{
    const s3Client = new client_s3_namespaceObject.S3Client(config);
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
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});

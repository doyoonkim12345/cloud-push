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
    FirebaseStorageClient: ()=>FirebaseStorageClient,
    SupabaseStorageClient: ()=>SupabaseStorageClient,
    StorageClient: ()=>StorageClient,
    DbClient: ()=>DbClient,
    SupabaseDbClient: ()=>SupabaseDbClient,
    AWSS3StorageClient: ()=>AWSS3StorageClient,
    LowDbClient: ()=>LowDbClient,
    FirebaseDbClient: ()=>FirebaseDbClient,
    LowDbLoader: ()=>LowDbLoader
});
const client_s3_namespaceObject = require("@aws-sdk/client-s3");
const s3_request_presigner_namespaceObject = require("@aws-sdk/s3-request-presigner");
const external_node_path_namespaceObject = require("node:path");
const external_node_fs_namespaceObject = require("node:fs");
const lib_storage_namespaceObject = require("@aws-sdk/lib-storage");
class StorageClient {
}
class AWSS3StorageClient extends StorageClient {
    client;
    bucketName;
    constructor({ region, accessKeyId, secretAccessKey, bucketName }){
        super();
        this.client = new client_s3_namespaceObject.S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey
            }
        });
        this.bucketName = bucketName;
    }
    getFile = async ({ key })=>{
        const command = new client_s3_namespaceObject.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key
        });
        const response = await this.client.send(command);
        if (!response.Body) throw new Error("File content is empty");
        const stream = response.Body;
        const chunks = [];
        for await (const chunk of stream)chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const buffer = Buffer.concat(chunks);
        return buffer;
    };
    getFileSignedUrl = async ({ key, expiresIn })=>{
        const command = new client_s3_namespaceObject.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key
        });
        const url = await (0, s3_request_presigner_namespaceObject.getSignedUrl)(this.client, command, {
            expiresIn
        });
        return url;
    };
    uploadFile = async ({ key, file, contentType = "application/json" })=>{
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: file,
            ContentType: contentType
        };
        const command = new client_s3_namespaceObject.PutObjectCommand(params);
        await this.client.send(command);
    };
    uploadLocalFile = async ({ fileName, filePath })=>{
        const fileStream = external_node_fs_namespaceObject.createReadStream(filePath);
        const upload = new lib_storage_namespaceObject.Upload({
            client: this.client,
            params: {
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileStream
            }
        });
        const result = await upload.done();
        return result.Location;
    };
    uploadDirectory = async ({ cloudPath, directoryPath })=>{
        const uploadedFiles = {};
        const stats = external_node_fs_namespaceObject.statSync(directoryPath);
        if (!stats.isDirectory()) throw new Error(`${directoryPath} is not a directory.`);
        const allFiles = [];
        function collectFiles(dir, base = "") {
            const files = external_node_fs_namespaceObject.readdirSync(dir);
            for (const file of files){
                const filePath = external_node_path_namespaceObject.join(dir, file);
                const relPath = external_node_path_namespaceObject.join(base, file);
                const fileStats = external_node_fs_namespaceObject.statSync(filePath);
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
            const s3Key = external_node_path_namespaceObject.join(cloudPath, relativePath).replace(/\\/g, "/");
            const location = await this.uploadLocalFile({
                filePath,
                fileName: s3Key
            });
            if (location) uploadedFiles[relativePath] = location;
        }
    };
}
const firestore_namespaceObject = require("firebase-admin/firestore");
class DbClient {
}
const app_namespaceObject = require("firebase-admin/app");
let initialize_app;
const initialize = (credential, httpAgent)=>{
    if (!initialize_app) {
        if (0 === (0, app_namespaceObject.getApps)().length) {
            const serviceAccount = JSON.parse(credential);
            initialize_app = (0, app_namespaceObject.initializeApp)({
                credential: (0, app_namespaceObject.cert)({
                    ...serviceAccount,
                    private_key: serviceAccount.private_key?.replace(/\\n/g, "\n")
                }, httpAgent)
            });
        } else initialize_app = (0, app_namespaceObject.getApps)()[0];
    }
    return initialize_app;
};
class FirebaseDbClient extends DbClient {
    db;
    collectionName;
    constructor({ credential, httpAgent, tableName = "bundles", databaseId }){
        super();
        const app = initialize(credential, httpAgent);
        this.db = (0, firestore_namespaceObject.getFirestore)(app, databaseId);
        this.collectionName = tableName;
    }
    create = async ({ bundle })=>{
        await this.db.collection(this.collectionName).doc(bundle.bundleId).set(bundle, {
            merge: true
        });
    };
    readAll = async ()=>{
        const snapshot = await this.db.collection(this.collectionName).get();
        return snapshot.docs.map((doc)=>doc.data());
    };
    find = async ({ conditions })=>{
        let query = this.db.collection(this.collectionName);
        for (const [key, value] of Object.entries(conditions))query = query.where(key, "==", value);
        const snapshot = await query.limit(1).get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    };
    findAll = async ({ conditions, sortOptions = [] })=>{
        let query = this.db.collection(this.collectionName);
        for (const [key, value] of Object.entries(conditions))if (void 0 !== value) query = query.where(key, "==", value);
        for (const { field, direction } of sortOptions)query = query.orderBy(field, direction);
        const snapshot = await query.get();
        return snapshot.docs.map((doc)=>doc.data());
    };
    update = async ({ bundle })=>{
        await this.db.collection(this.collectionName).doc(bundle.bundleId).update(bundle);
    };
    delete = async ({ bundleId })=>{
        await this.db.collection(this.collectionName).doc(bundleId).delete();
    };
    toBuffer = async ()=>{
        const bundles = await this.readAll();
        const jsonString = JSON.stringify({
            bundles
        });
        return Buffer.from(jsonString, "utf-8");
    };
    init = async ()=>{
        console.log("Initialized Firebase client");
    };
    sync = async ()=>{
        console.log("Firestore is always in sync");
    };
}
const storage_namespaceObject = require("firebase-admin/storage");
class FirebaseStorageClient extends StorageClient {
    bucket;
    constructor({ credential, httpAgent, bucketName = "bundles" }){
        super();
        const app = initialize(credential, httpAgent);
        this.bucket = (0, storage_namespaceObject.getStorage)(app).bucket(bucketName);
    }
    getFile = async ({ key })=>{
        const file = this.bucket.file(key);
        const chunks = [];
        const stream = file.createReadStream();
        for await (const chunk of stream)chunks.push(chunk);
        return Buffer.concat(chunks);
    };
    getFileSignedUrl = async ({ key, expiresIn = 3600 })=>{
        const file = this.bucket.file(key);
        const [url] = await file.getSignedUrl({
            action: "read",
            expires: Date.now() + 1000 * expiresIn
        });
        return url;
    };
    uploadFile = async ({ key, file, contentType = "application/octet-stream" })=>{
        const fileRef = this.bucket.file(key);
        await fileRef.save(file, {
            contentType,
            resumable: false
        });
    };
    uploadLocalFile = async ({ fileName, filePath })=>{
        const [uploaded] = await this.bucket.upload(filePath, {
            destination: fileName
        });
        return `gs://${uploaded.bucket.name}/${uploaded.name}`;
    };
    uploadDirectory = async ({ cloudPath, directoryPath })=>{
        const uploadedFiles = {};
        const stats = external_node_fs_namespaceObject.statSync(directoryPath);
        if (!stats.isDirectory()) throw new Error(`${directoryPath} is not a directory.`);
        const allFiles = [];
        function collectFiles(dir, base = "") {
            const files = external_node_fs_namespaceObject.readdirSync(dir);
            for (const file of files){
                const filePath = external_node_path_namespaceObject.join(dir, file);
                const relPath = external_node_path_namespaceObject.join(base, file);
                const fileStats = external_node_fs_namespaceObject.statSync(filePath);
                if (fileStats.isDirectory()) collectFiles(filePath, relPath);
                else allFiles.push({
                    path: filePath,
                    relativePath: relPath
                });
            }
        }
        collectFiles(directoryPath);
        for (const { path: filePath, relativePath } of allFiles){
            const storagePath = external_node_path_namespaceObject.join(cloudPath, relativePath).replace(/\\/g, "/");
            const url = await this.uploadLocalFile({
                filePath,
                fileName: storagePath
            });
            uploadedFiles[relativePath] = url;
        }
    };
}
const external_lowdb_namespaceObject = require("lowdb");
const core_namespaceObject = require("@cloud-push/core");
const node_namespaceObject = require("lowdb/node");
const LowDbLoader = {
    loadLowDb: async (value)=>{
        const adapter = new external_lowdb_namespaceObject.Memory();
        const db = new external_lowdb_namespaceObject.Low(adapter, value ?? {});
        db.data = value ?? {};
        return db;
    },
    loadLowDbFromFile: async (file, defaultValue)=>{
        const db = await LowDbLoader.loadLowDb(await (0, core_namespaceObject.parseFileAsJson)(file));
        return db;
    },
    loadLowDbFromPath: async (filePath, defaultValue)=>{
        const adapter = new node_namespaceObject.JSONFile(filePath);
        const db = new external_lowdb_namespaceObject.Low(adapter, defaultValue ?? {});
        return db;
    }
};
class LowDbClient extends DbClient {
    db;
    downloadJSONFile;
    uploadJSONFile;
    constructor({ downloadJSONFile, uploadJSONFile }){
        super();
        this.downloadJSONFile = downloadJSONFile;
        this.uploadJSONFile = uploadJSONFile;
        this.db = null;
    }
    create = async ({ bundle })=>{
        await this.db?.update(({ bundles })=>bundles.push(bundle));
    };
    readAll = async ()=>this.db?.data.bundles ?? [];
    find = async ({ conditions })=>{
        const bundle = this.db?.data.bundles.find((bundle)=>this.matchesConditions(bundle, conditions));
        return bundle || null;
    };
    findAll = async ({ conditions, sortOptions = [] })=>{
        const filteredBundles = this.db?.data.bundles.filter((bundle)=>this.matchesConditions(bundle, conditions)) ?? [];
        if (sortOptions.length > 0) return this.sortBundles(filteredBundles, sortOptions);
        return filteredBundles;
    };
    sortBundles(bundles, sortOptions) {
        if (0 === sortOptions.length) return bundles;
        return [
            ...bundles
        ].sort((a, b)=>{
            for (const option of sortOptions){
                const { field, direction } = option;
                const aValue = a[field];
                const bValue = b[field];
                if (aValue < bValue) return "asc" === direction ? -1 : 1;
                if (aValue > bValue) return "asc" === direction ? 1 : -1;
            }
            return 0;
        });
    }
    matchesConditions(bundle, conditions) {
        return Object.entries(conditions).every(([key, value])=>{
            if (void 0 === value) return true;
            return bundle[key] === value;
        });
    }
    update = async ({ bundle })=>{
        console.log("Updating bundle", bundle.bundleId);
        await this.db?.update(({ bundles })=>{
            const index = bundles.findIndex((e)=>e.bundleId === bundle.bundleId);
            console.log(index, bundles[index]);
            if (index !== -1) {
                bundles[index] = bundle;
                console.log(bundles);
                return true;
            }
            return false;
        });
    };
    delete = async ({ bundleId })=>{
        console.log("Deleting bundle", bundleId);
        await this.db?.update(({ bundles })=>{
            const filtered = bundles.filter((bundle)=>bundle.bundleId !== bundleId);
            bundles.length = 0;
            bundles.push(...filtered);
        });
    };
    toBuffer = async ()=>{
        const jsonString = JSON.stringify(this.db?.data);
        return Buffer.from(jsonString, "utf-8");
    };
    init = async ()=>{
        try {
            const file = await this.downloadJSONFile();
            const db = await LowDbLoader.loadLowDbFromFile(file);
            this.db = db;
        } catch (e) {
            const adapter = new external_lowdb_namespaceObject.Memory();
            const db = new external_lowdb_namespaceObject.Low(adapter, {
                bundles: []
            });
            this.db = db;
        }
    };
    sync = async ()=>{
        const file = await this.toBuffer();
        await this.uploadJSONFile(file);
    };
}
const supabase_js_namespaceObject = require("@supabase/supabase-js");
class SupabaseDbClient extends DbClient {
    client;
    tableName;
    constructor({ supabaseUrl, supabaseKey, tableName = "bundles" }){
        super();
        this.client = (0, supabase_js_namespaceObject.createClient)(supabaseUrl, supabaseKey);
        this.tableName = tableName;
    }
    create = async ({ bundle })=>{
        const { error } = await this.client.from(this.tableName).insert(bundle);
        if (error) throw new Error(`Failed to create bundle: ${error.message}`);
    };
    readAll = async ()=>{
        const { data, error } = await this.client.from(this.tableName).select("*");
        if (error) throw new Error(`Failed to read bundles: ${error.message}`);
        return data;
    };
    find = async ({ conditions })=>{
        let query = this.client.from(this.tableName).select("*");
        for (const [key, value] of Object.entries(conditions))query = query.eq(key, value);
        const { data, error } = await query.limit(1).single();
        if (error && "PGRST116" !== error.code) throw new Error(`Failed to find bundle: ${error.message}`);
        return data;
    };
    findAll = async ({ conditions, sortOptions = [] })=>{
        let query = this.client.from(this.tableName).select("*");
        for (const [key, value] of Object.entries(conditions))query = query.eq(key, value);
        for (const option of sortOptions){
            const { field, direction } = option;
            query = query.order(field, {
                ascending: "asc" === direction
            });
        }
        const { data, error } = await query;
        if (error) throw new Error(`Failed to find bundles: ${error.message}`);
        return data;
    };
    update = async ({ bundle })=>{
        console.log("Updating bundle", bundle.bundleId);
        const { error } = await this.client.from(this.tableName).update(bundle).eq("bundleId", bundle.bundleId);
        if (error) throw new Error(`Failed to update bundle: ${error.message}`);
    };
    delete = async ({ bundleId })=>{
        console.log("Deleting bundle", bundleId);
        const { error } = await this.client.from(this.tableName).delete().eq("bundleId", bundleId);
        if (error) throw new Error(`Failed to delete bundle: ${error.message}`);
    };
    toBuffer = async ()=>{
        const bundles = await this.readAll();
        const jsonString = JSON.stringify({
            bundles
        });
        return Buffer.from(jsonString, "utf-8");
    };
    init = async ()=>{
        console.log("Initialized Supabase client");
    };
    sync = async ()=>{
        console.log("Supabase is always in sync");
    };
}
class SupabaseStorageClient extends StorageClient {
    client;
    bucketName;
    constructor({ supabaseUrl, supabaseKey, bucketName }){
        super();
        this.client = (0, supabase_js_namespaceObject.createClient)(supabaseUrl, supabaseKey);
        this.bucketName = bucketName;
        console.log(supabaseUrl, supabaseKey);
    }
    getFile = async ({ key, mimeType })=>{
        const { data, error } = await this.client.storage.from(this.bucketName).download(key);
        if (error) throw new Error(`Error downloading file: ${error.message}`);
        if (!data) throw new Error("File content is empty");
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer;
    };
    getFileSignedUrl = async ({ key, expiresIn = 3600 })=>{
        const { data, error } = await this.client.storage.from(this.bucketName).createSignedUrl(key, expiresIn);
        if (error) throw new Error(`Error creating signed URL: ${error.message}`);
        if (!data || !data.signedUrl) throw new Error("Failed to generate signed URL");
        return data.signedUrl;
    };
    uploadFile = async ({ key, file, contentType = "application/json" })=>{
        const { error } = await this.client.storage.from(this.bucketName).upload(key, file, {
            contentType,
            upsert: true
        });
        if (error) throw new Error(`Error uploading file: ${error.message}`);
    };
    uploadLocalFile = async ({ filePath, fileName })=>{
        const fileBuffer = external_node_fs_namespaceObject.readFileSync(filePath);
        const contentType = this.getContentType(filePath);
        const { error } = await this.client.storage.from(this.bucketName).upload(fileName, fileBuffer, {
            contentType,
            upsert: true
        });
        if (error) throw new Error(`Error uploading local file: ${error.message}`);
        const { data: publicUrlData } = await this.client.storage.from(this.bucketName).getPublicUrl(fileName);
        return publicUrlData.publicUrl;
    };
    uploadDirectory = async ({ cloudPath, directoryPath })=>{
        const uploadedFiles = {};
        const stats = external_node_fs_namespaceObject.statSync(directoryPath);
        if (!stats.isDirectory()) throw new Error(`${directoryPath} is not a directory.`);
        const allFiles = [];
        function collectFiles(dir, base = "") {
            const files = external_node_fs_namespaceObject.readdirSync(dir);
            for (const file of files){
                const filePath = external_node_path_namespaceObject.join(dir, file);
                const relPath = external_node_path_namespaceObject.join(base, file);
                const fileStats = external_node_fs_namespaceObject.statSync(filePath);
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
            const s3Key = external_node_path_namespaceObject.join(cloudPath, relativePath).replace(/\\/g, "/");
            const publicUrl = await this.uploadLocalFile({
                filePath,
                fileName: s3Key
            });
            if (publicUrl) uploadedFiles[relativePath] = publicUrl;
        }
    };
    getContentType(filePath) {
        const extension = external_node_path_namespaceObject.extname(filePath).toLowerCase();
        const contentTypeMap = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "application/javascript",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".pdf": "application/pdf",
            ".txt": "text/plain",
            ".mp4": "video/mp4",
            ".mp3": "audio/mpeg"
        };
        return contentTypeMap[extension] || "application/octet-stream";
    }
    deleteFile = async (key)=>{
        const { error } = await this.client.storage.from(this.bucketName).remove([
            key
        ]);
        if (error) throw new Error(`Error deleting file: ${error.message}`);
    };
    deleteFiles = async (keys)=>{
        const { error } = await this.client.storage.from(this.bucketName).remove(keys);
        if (error) throw new Error(`Error deleting files: ${error.message}`);
    };
    copyFile = async (fromKey, toKey)=>{
        const { error } = await this.client.storage.from(this.bucketName).copy(fromKey, toKey);
        if (error) throw new Error(`Error copying file: ${error.message}`);
    };
    moveFile = async (fromKey, toKey)=>{
        await this.copyFile(fromKey, toKey);
        await this.deleteFile(fromKey);
    };
}
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});

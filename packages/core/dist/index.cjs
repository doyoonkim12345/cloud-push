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
    parseFileAsJson: ()=>parseFileAsJson,
    init: ()=>init,
    loadFileEnv: ()=>loadFileEnv,
    createConfigTemplate: ()=>createConfigTemplate,
    getCwd: ()=>getCwd,
    groupBy: ()=>groupBy,
    createJsonFile: ()=>createJsonFile
});
function createJsonFile(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([
        jsonString
    ], {
        type: "application/json"
    });
    const file = new File([
        blob
    ], filename, {
        type: "application/json"
    });
    return file;
}
const external_workspace_tools_namespaceObject = require("workspace-tools");
const getCwd = ()=>(0, external_workspace_tools_namespaceObject.findPackageRoot)(process.cwd());
const groupBy = (array, key)=>array.reduce((acc, item)=>{
        const groupKey = String(item[key]);
        acc[groupKey] ??= [];
        acc[groupKey].push(item);
        return acc;
    }, {});
function parseFileAsJson(buffer) {
    try {
        const text = buffer.toString("utf-8");
        return JSON.parse(text);
    } catch (error) {
        console.error("JSON 파싱 중 오류 발생:", error);
        throw new Error(`JSON 파싱 실패: ${error.message}`);
    }
}
const external_dotenv_namespaceObject = require("dotenv");
const external_node_path_namespaceObject = require("node:path");
const external_node_fs_namespaceObject = require("node:fs");
async function loadFileEnv(environment) {
    const envFiles = [
        `.env.${environment}.local`,
        ".env.local",
        `.env.${environment}`,
        ".env"
    ];
    for (const file of envFiles){
        const filePath = external_node_path_namespaceObject.resolve(getCwd(), file);
        try {
            await external_node_fs_namespaceObject.promises.access(filePath);
            external_dotenv_namespaceObject.config({
                path: filePath,
                override: true
            });
        } catch (error) {}
    }
}
const createConfigTemplate = ({ db, storage, where })=>{
    const importMethods = [];
    let storageClientInstance = "";
    let dbClientInstance = "";
    switch(storage){
        case "AWS_S3":
            importMethods.push("AWSS3StorageClient");
            storageClientInstance = `
const storageClient = new AWSS3StorageClient({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    bucketName: process.env.AWS_BUCKET_NAME!,
    region: process.env.AWS_REGION!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
            `;
            break;
        case "FIREBASE":
            importMethods.push("FirebaseStorageClient");
            storageClientInstance = `
const storageClient = new FirebaseStorageClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    bucketName: process.env.FIREBASE_BUCKET_NAME!,
});
            `;
            break;
        case "SUPABASE":
            importMethods.push("SupabaseStorageClient");
            storageClientInstance = `
const storageClient = new SupabaseStorageClient({
    bucketName: process.env.SUPABASE_BUCKET_NAME,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
});
            `;
            break;
        case "CUSTOM":
            importMethods.push("StorageClient");
            storageClientInstance = `
const generateStorageClient = (): StorageClient => {
	return {
		getFile: () => {},
		getFileSignedUrl: () => {},
		uploadDirectory: () => {},
		uploadFile: () => {},
		uploadLocalFile: () => {},
	};
};
const storageClient = generateStorageClient();
`;
            break;
        default:
            break;
    }
    switch(db){
        case "FIREBASE":
            importMethods.push("FirebaseDbClient");
            dbClientInstance = `
const dbClient = new FirebaseDbClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    databaseId: process.env.FIREBASE_DATABASE_ID!,
});
            `;
            break;
        case "LOWDB":
            importMethods.push("LowDbClient");
            dbClientInstance = `
const dbClient = new LowDbClient({
    downloadJSONFile: () => storageClient.getFile({ key: "cursor.json" }),
    uploadJSONFile: (file: Buffer) =>
    storageClient.uploadFile({ key: "cursor.json", file }),
});
            `;
            break;
        case "SUPABASE":
            importMethods.push("SupabaseDbClient");
            dbClientInstance = `
const dbClient = new SupabaseDbClient({
    tableName: process.env.SUPABASE_TABLE_NAME!,
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_KEY!,
});
            `;
            break;
        case "CUSTOM":
            importMethods.push("DbClient");
            dbClientInstance = `
const generateDbClient = (): DbClient => {
	return {
		create: () => {},
		delete: () => {},
		find: () => {},
		findAll: () => {},
		readAll: () => {},
		toBuffer: () => {},
		update: () => {},
	};
};
const dbClient = generateDbClient();
`;
            break;
        default:
            break;
    }
    return `
import { defineConfig } from "@cloud-push/${where}";
import { ${[
        importMethods.join(", ")
    ]} } from "@cloud-push/cloud";
${storageClientInstance}
${dbClientInstance}
export default defineConfig(() => ({
	storage: storageClient,
	db: dbClient,
}));
`;
};
const prompts_namespaceObject = require("@clack/prompts");
async function selectStorageClient() {
    const storage = await prompts_namespaceObject.select({
        message: "Select Storage client",
        options: [
            {
                value: "AWS_S3",
                label: "AWS_S3"
            },
            {
                value: "FIREBASE",
                label: "Firebase storage"
            },
            {
                value: "SUPABASE",
                label: "Supabase R2"
            },
            {
                value: "CUSTOM",
                label: "Custom"
            }
        ],
        initialValue: "AWS_S3"
    });
    if (!storage) throw new Error("No DbClient selected. Exiting...");
    return storage;
}
async function selectDbClient() {
    const Db = await prompts_namespaceObject.select({
        message: "Select Db client",
        options: [
            {
                value: "LOWDB",
                label: "Lowdb(json)"
            },
            {
                value: "FIREBASE",
                label: "Firebase firestore"
            },
            {
                value: "SUPABASE",
                label: "Supabase"
            },
            {
                value: "CUSTOM",
                label: "Custom"
            }
        ],
        initialValue: "LOWDB"
    });
    if (!Db) throw new Error("No DbClient selected. Exiting...");
    return Db;
}
const init = async (where)=>{
    try {
        const db = await selectDbClient();
        const storage = await selectStorageClient();
        const template = createConfigTemplate({
            db,
            storage,
            where
        });
        const cwd = getCwd();
        const filePath = external_node_path_namespaceObject.resolve(cwd, "cloud-push.config.ts");
        external_node_fs_namespaceObject.writeFileSync(filePath, template.trimStart(), "utf8");
        prompts_namespaceObject.outro("Config Generated Successfully! 🎉");
    } catch (e) {
        console.error(e);
        prompts_namespaceObject.outro("Config Generation failed");
    }
};
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});

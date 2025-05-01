import * as __WEBPACK_EXTERNAL_MODULE_workspace_tools_2c254f81__ from "workspace-tools";
import * as __WEBPACK_EXTERNAL_MODULE_dotenv__ from "dotenv";
import * as __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__ from "node:path";
import * as __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__ from "node:fs";
import * as __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__ from "@clack/prompts";
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
const getCwd = ()=>(0, __WEBPACK_EXTERNAL_MODULE_workspace_tools_2c254f81__.findPackageRoot)(process.cwd());
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
async function loadFileEnv(environment) {
    const envFiles = [
        `.env.${environment}.local`,
        ".env.local",
        `.env.${environment}`,
        ".env"
    ];
    for (const file of envFiles){
        const filePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.resolve(getCwd(), file);
        try {
            await __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.promises.access(filePath);
            __WEBPACK_EXTERNAL_MODULE_dotenv__.config({
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
async function selectStorageClient() {
    const storage = await __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__.select({
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
    const Db = await __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__.select({
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
        const filePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.resolve(cwd, "cloud-push.config.ts");
        __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.writeFileSync(filePath, template.trimStart(), "utf8");
        __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__.outro("Config Generated Successfully! 🎉");
    } catch (e) {
        console.error(e);
        __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__.outro("Config Generation failed");
    }
};
export { createConfigTemplate, createJsonFile, getCwd, groupBy, init, loadFileEnv, parseFileAsJson };

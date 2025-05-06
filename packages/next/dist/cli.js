import * as __WEBPACK_EXTERNAL_MODULE_commander__ from "commander";
import * as __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__ from "node:path";
import * as __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__ from "node:fs";
import * as __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__ from "@clack/prompts";
import * as __WEBPACK_EXTERNAL_MODULE_workspace_tools_2c254f81__ from "workspace-tools";
const createServerTemplate = ({ db, storage })=>{
    const importMethods = [];
    let storageClientInstance = "";
    let dbClientInstance = "";
    switch(storage){
        case "AWS_S3":
            importMethods.push("AWSS3StorageClient");
            storageClientInstance = `
export const storageNodeClient = new AWSS3StorageClient({
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
export const storageNodeClient = new FirebaseStorageClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    bucketName: process.env.FIREBASE_BUCKET_NAME!,
});
            `;
            break;
        case "SUPABASE":
            importMethods.push("SupabaseStorageClient");
            storageClientInstance = `
export const storageNodeClient = new SupabaseStorageClient({
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
export const storageNodeClient = generateStorageClient();
`;
            break;
        default:
            break;
    }
    switch(db){
        case "FIREBASE":
            importMethods.push("FirebaseDbClient");
            dbClientInstance = `
export const dbNodeClient = new FirebaseDbClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    databaseId: process.env.FIREBASE_DATABASE_ID!,
});
            `;
            break;
        case "LOWDB":
            importMethods.push("LowDbClient");
            dbClientInstance = `
export const dbNodeClient = new LowDbClient({
    downloadJSONFile: () => storageNodeClient.getFile({ key: "cursor.json" }),
    uploadJSONFile: (file: Buffer) =>
    storageNodeClient.uploadFile({ key: "cursor.json", file }),
});
            `;
            break;
        case "SUPABASE":
            importMethods.push("SupabaseDbClient");
            dbClientInstance = `
export const dbNodeClient = new SupabaseDbClient({
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
export const dbNodeClient = generateDbClient();
`;
            break;
        default:
            break;
    }
    return `
import { generateBrowserClient } from "@cloud-push/next";
import { ${[
        importMethods.join(", ")
    ]} } from "@cloud-push/cloud";
${storageClientInstance}
${dbClientInstance}

export const storageBrowserClient = generateBrowserClient(storageNodeClient);
export const dbBrowserClient = generateBrowserClient(dbNodeClient);
`;
};
const createBrowserTemplate = ()=>`
"use server";

import { generateBrowserClient } from "@cloud-push/next";
import { storageNodeClient, dbNodeClient } from "./cloud-push.server";

export const storageBrowserClient = generateBrowserClient(storageNodeClient);
export const dbBrowserClient = generateBrowserClient(dbNodeClient);
`;
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
const getCwd = ()=>(0, __WEBPACK_EXTERNAL_MODULE_workspace_tools_2c254f81__.findPackageRoot)(process.cwd());
const init = async ()=>{
    try {
        const db = await selectDbClient();
        const storage = await selectStorageClient();
        const serverTemplate = createServerTemplate({
            db,
            storage
        });
        const browserTemplate = createBrowserTemplate();
        const cwd = getCwd();
        const serverFilePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.resolve(cwd, "cloud-push.server.ts");
        __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.writeFileSync(serverFilePath, serverTemplate.trimStart(), "utf8");
        const browserFilePath = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__.resolve(cwd, "cloud-push.browser.ts");
        __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__.writeFileSync(browserFilePath, browserTemplate.trimStart(), "utf8");
        __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__.outro("Config Generated Successfully! 🎉");
    } catch (e) {
        console.error(e);
        __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__.outro("Config Generation failed");
    }
};
const program = new __WEBPACK_EXTERNAL_MODULE_commander__.Command();
program.name("cloud-push");
program.command("init").action(init);
program.parse(process.argv);
if (!process.argv.slice(2).length) program.outputHelp();

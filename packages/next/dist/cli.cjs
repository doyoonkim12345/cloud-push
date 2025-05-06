"use strict";
var __webpack_exports__ = {};
const external_commander_namespaceObject = require("commander");
const external_node_path_namespaceObject = require("node:path");
const external_node_fs_namespaceObject = require("node:fs");
const prompts_namespaceObject = require("@clack/prompts");
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
const external_workspace_tools_namespaceObject = require("workspace-tools");
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
const getCwd = ()=>(0, external_workspace_tools_namespaceObject.findPackageRoot)(process.cwd());
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
        const serverFilePath = external_node_path_namespaceObject.resolve(cwd, "cloud-push.server.ts");
        external_node_fs_namespaceObject.writeFileSync(serverFilePath, serverTemplate.trimStart(), "utf8");
        const browserFilePath = external_node_path_namespaceObject.resolve(cwd, "cloud-push.browser.ts");
        external_node_fs_namespaceObject.writeFileSync(browserFilePath, browserTemplate.trimStart(), "utf8");
        prompts_namespaceObject.outro("Config Generated Successfully! 🎉");
    } catch (e) {
        console.error(e);
        prompts_namespaceObject.outro("Config Generation failed");
    }
};
const program = new external_commander_namespaceObject.Command();
program.name("cloud-push");
program.command("init").action(init);
program.parse(process.argv);
if (!process.argv.slice(2).length) program.outputHelp();
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});

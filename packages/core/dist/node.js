import * as __WEBPACK_EXTERNAL_MODULE__clack_prompts_3cae1695__ from "@clack/prompts";
import * as __WEBPACK_EXTERNAL_MODULE_workspace_tools_2c254f81__ from "workspace-tools";
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
export { getCwd, selectDbClient, selectStorageClient };

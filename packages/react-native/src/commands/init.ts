import { getCwd } from "@/lib/getCwd";
import * as path from "node:path";
import * as fs from "node:fs";
type Db = "lowDb" | "firebase" | "supabase";
type Storage = "aws" | "firebase" | "supabase";

const createTemplate = ({ db, storage }: { db: Db; storage: Storage }) => {
	const importMethods: string[] = [];

	let storageClientInstance = "";
	let dbClientInstance = "";

	switch (storage) {
		case "aws":
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
		case "firebase":
			importMethods.push("FirebaseStorageClient");
			storageClientInstance = `
const storageClient = new FirebaseStorageClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    bucketName: process.env.FIREBASE_BUCKET_NAME!,
});
            `;
			break;
		case "supabase":
			importMethods.push("SupabaseStorageClient");
			storageClientInstance = `
const storageClient = new SupabaseStorageClient({
    bucketName: process.env.SUPABASE_BUCKET_NAME,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
});
            `;
			break;
		default:
			break;
	}

	switch (db) {
		case "firebase":
			importMethods.push("FirebaseDbClient");
			dbClientInstance = `
const dbClient = new FirebaseDbClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    databaseId: process.env.FIREBASE_DATABASE_ID!,
});
            `;
			break;
		case "lowDb":
			importMethods.push("LowDbClient");
			dbClientInstance = `
const dbClient = new LowDbClient({
    downloadJSONFile: () => storageClient.getFile({ key: "cursor.json" }),
    uploadJSONFile: (file: Buffer) =>
    storageClient.uploadFile({ key: "cursor.json", file }),
});
            `;
			break;
		case "supabase":
			importMethods.push("SupabaseDbClient");
			dbClientInstance = `
const dbClient = new SupabaseDbClient({
    tableName: process.env.SUPABASE_TABLE_NAME!,
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_KEY!,
});
            `;
			break;
		default:
			break;
	}

	return `
import { defineConfig } from "@cloud-push/react-native";
import { ${[importMethods.join(", ")]} } from "@cloud-push/cloud";
${storageClientInstance}
${dbClientInstance}
export default defineConfig(() => ({
	storage: storageClient,
	db: dbClient,
}));
`;
};

export const init = async () => {
	const template = createTemplate({ db: "supabase", storage: "firebase" });

	const cwd = getCwd();

	const filePath = path.resolve(cwd, "cloud-push.config.ts");
	fs.writeFileSync(filePath, template.trimStart(), "utf8");
};

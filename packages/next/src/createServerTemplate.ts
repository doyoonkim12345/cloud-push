import type { Db, Storage } from "@cloud-push/core";

export const createServerTemplate = ({
	db,
	storage,
}: { db: Db; storage: Storage }) => {
	const importMethods: string[] = [];

	let storageClientInstance = "";
	let dbClientInstance = "";

	switch (storage) {
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

	switch (db) {
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
import { ${[importMethods.join(", ")]} } from "@cloud-push/cloud";
${storageClientInstance}
${dbClientInstance}

export const storageBrowserClient = generateBrowserClient(storageNodeClient);
export const dbBrowserClient = generateBrowserClient(dbNodeClient);
`;
};

import type { Db, Storage } from "@cloud-push/cloud";

export const createConfigTemplate = ({
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

	switch (db) {
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
    uploadJSONFile: (file: Uint8Array) =>
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
		toUint8Array: () => {},
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
import { defineConfig } from "@cloud-push/cli";
import { ${[importMethods.join(", ")]} } from "@cloud-push/cloud";

export default defineConfig(() => ({
	loadClients: () => {
		const storageClient = ${storageClientInstance};
		const dbClient = ${dbClientInstance};	

		return {
			storage: storageClient,
			db: dbClient,
		};
	},
}));
`;
};

import { defineConfig } from "@cloud-push/cli";
import {} from "@cloud-push/cloud";
import version from "./version";

// const storageClient = new AWSS3StorageClient({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//   bucketName: process.env.AWS_BUCKET_NAME!,
//   region: process.env.AWS_REGION!,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
// });

// const dbClient = new LowDbClient({
//   downloadJSONFile: () => storageClient.getFile({ key: "cursor.json" }),
//   uploadJSONFile: (file: Buffer) =>
//     storageClient.uploadFile({ key: "cursor.json", file }),
// });

// const storageClient = new SupabaseStorageClient({
// 	bucketName: process.env.SUPABASE_BUCKET_NAME,
// 	supabaseUrl: process.env.SUPABASE_URL,
// 	supabaseKey: process.env.SUPABASE_KEY,
// });

// const dbClient = new SupabaseDbClient({
// 	tableName: process.env.SUPABASE_TABLE_NAME,
// 	supabaseUrl: process.env.SUPABASE_URL,
// 	supabaseKey: process.env.SUPABASE_KEY,
// });

// const storageClient = new FirebaseStorageClient({
// 	credential: process.env.FIREBASE_CREDENTIAL!,
// 	bucketName: process.env.FIREBASE_BUCKET_NAME!,
// });

// const dbClient = new FirebaseDbClient({
// 	credential: process.env.FIREBASE_CREDENTIAL!,
// 	databaseId: process.env.FIREBASE_DATABASE_ID!,
// });

export default defineConfig(() => ({
	runtimeVersion: version.runtimeVersion,
	storage: storageClient,
	db: dbClient,
}));

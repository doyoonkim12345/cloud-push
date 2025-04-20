import {
	FirebaseDbClient,
	FirebaseStorageClient,
	SupabaseDbClient,
	SupabaseStorageClient,
} from "@cloud-push/cloud";

// export const storageNodeClient = new AWSS3StorageClient({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//   bucketName: process.env.AWS_BUCKET_NAME!,
//   region: process.env.AWS_REGION!,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
// });

// export const dbNodeClient = new LowDbClient({
//   downloadJSONFile: () => storageNodeClient.getFile({ key: "cursor.json" }),
//   uploadJSONFile: (file: Buffer) =>
//     storageNodeClient.uploadFile({ key: "cursor.json", file }),
// });

// export const storageNodeClient = new SupabaseStorageClient({
//   bucketName: process.env.SUPABASE_BUCKET_NAME!,
//   supabaseUrl: process.env.SUPABASE_URL!,
//   supabaseKey: process.env.SUPABASE_KEY!,
// });

// export const dbNodeClient = new SupabaseDbClient({
//   tableName: process.env.SUPABASE_TABLE_NAME,
//   supabaseUrl: process.env.SUPABASE_URL!,
//   supabaseKey: process.env.SUPABASE_KEY!,
// });

export const storageNodeClient = new FirebaseStorageClient({
	credential: process.env.FIREBASE_CREDENTIAL!,
	bucketName: process.env.FIREBASE_BUCKET_NAME!,
});

export const dbNodeClient = new FirebaseDbClient({
	credential: process.env.FIREBASE_CREDENTIAL!,
	databaseId: process.env.FIREBASE_DATABASE_ID!,
});

import { defineConfig } from "@cloud-push/expo";
import { SupabaseStorageClient, SupabaseDbClient } from "@cloud-push/cloud";
import version from "./version";

const storageClient = new SupabaseStorageClient({
	bucketName: process.env.SUPABASE_BUCKET_NAME,
	supabaseUrl: process.env.SUPABASE_URL,
	supabaseKey: process.env.SUPABASE_KEY,
});

const dbClient = new SupabaseDbClient({
	tableName: process.env.SUPABASE_TABLE_NAME!,
	supabaseUrl: process.env.SUPABASE_URL!,
	supabaseKey: process.env.SUPABASE_KEY!,
});

export default defineConfig(() => ({
	storage: storageClient,
	db: dbClient,
	runtimeVersion: version.runtimeVersion,
}));

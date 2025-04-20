import { defineConfig } from "@cloud-push/cli";
import { FirebaseStorageClient, SupabaseDbClient } from "@cloud-push/cloud";

const storageClient = new FirebaseStorageClient({
    credential: process.env.FIREBASE_CREDENTIAL!,
    bucketName: process.env.FIREBASE_BUCKET_NAME!,
});
            

const dbClient = new SupabaseDbClient({
    tableName: process.env.SUPABASE_TABLE_NAME!,
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_KEY!,
});
            
export default defineConfig(() => ({
	storage: storageClient,
	db: dbClient,
}));

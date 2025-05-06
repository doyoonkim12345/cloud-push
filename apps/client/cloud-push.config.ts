import { defineConfig } from "@cloud-push/react-native";
import { SupabaseStorageClient, SupabaseDbClient } from "@cloud-push/cloud";

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
}));

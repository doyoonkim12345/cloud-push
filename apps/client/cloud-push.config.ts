import { defineConfig } from "@cloud-push/cli";
import { SupabaseStorageClient, } from "@cloud-push/cloud";

export default defineConfig(() => ({
    storage: new SupabaseStorageClient({
        bucketName: process.env.SUPABASE_BUCKET_NAME,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY,
    }),
}));
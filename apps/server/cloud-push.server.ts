
import { SupabaseStorageClient, SupabaseDbClient } from "@cloud-push/cloud";

export const storageNodeClient = new SupabaseStorageClient({
  bucketName: process.env.SUPABASE_BUCKET_NAME,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
});



export const dbNodeClient = new SupabaseDbClient({
  tableName: process.env.SUPABASE_TABLE_NAME!,
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_KEY!,
});

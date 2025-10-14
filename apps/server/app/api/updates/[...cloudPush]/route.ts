import { ExpoClient, SupabaseStorageClient } from '@cloud-push/cloud'
import { handlers } from '@cloud-push/next'

export const { GET, POST } = handlers({
    storageClient: new SupabaseStorageClient({
        supabaseUrl: process.env.SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_KEY!,
        bucketName: process.env.SUPABASE_BUCKET_NAME!,
    }),
    expoClient: new ExpoClient({
        appId: process.env.EXPO_APP_ID!,
        token: process.env.EXPO_TOKEN!,
    }),
})
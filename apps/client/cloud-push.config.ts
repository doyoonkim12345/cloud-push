import { SupabaseStorageClient, SupabaseDbClient } from "@cloud-push/cloud";
import { defineConfig } from "@cloud-push/cli";
import sharedConfig from "./sharedConfig";

export default defineConfig(() => ({
	loadClients: () => {
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

		return {
			storage: storageClient,
			db: dbClient,
		};
	},
	envSource: "file",
	runtimeVersion: sharedConfig.runtimeVersion,
	channel: sharedConfig.channel,
	environment: "development",
	privateKeyPath: sharedConfig.privateKeyPath,
}));

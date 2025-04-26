import { defineConfig } from "@cloud-push/react-native";
import { FirebaseDbClient, FirebaseStorageClient } from "@cloud-push/cloud";
import version from "./version";

const storageClient = new FirebaseStorageClient({
	credential: process.env.FIREBASE_CREDENTIAL!,
	bucketName: process.env.FIREBASE_BUCKET_NAME!,
});

const dbClient = new FirebaseDbClient({
	credential: process.env.FIREBASE_CREDENTIAL!,
	databaseId: process.env.FIREBASE_DATABASE_ID!,
});

export default defineConfig(() => ({
	storage: storageClient,
	db: dbClient,
	runtimeVersion: version.runtimeVersion,
}));

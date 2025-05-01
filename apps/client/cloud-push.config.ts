import { defineConfig } from "@cloud-push/react-native";
import { AWSS3StorageClient, LowDbClient } from "@cloud-push/cloud";

const storageClient = new AWSS3StorageClient({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    bucketName: process.env.AWS_BUCKET_NAME!,
    region: process.env.AWS_REGION!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
            

const dbClient = new LowDbClient({
    downloadJSONFile: () => storageClient.getFile({ key: "cursor.json" }),
    uploadJSONFile: (file: Buffer) =>
    storageClient.uploadFile({ key: "cursor.json", file }),
});
            
export default defineConfig(() => ({
	storage: storageClient,
	db: dbClient,
}));

[![@cloud-push/cloud](https://img.shields.io/badge/@cloud--push/cloud-v1.1.3-blue)](https://www.npmjs.com/package/@cloud-push/cloud)  
[![@cloud-push/expo](https://img.shields.io/badge/@cloud--push/expo-v1.1.3-blue)](https://www.npmjs.com/package/@cloud-push/expo)  
[![@cloud-push/next](https://img.shields.io/badge/@cloud--push/next-v1.1.3-blue)](https://www.npmjs.com/package/@cloud-push/next)  
[![@cloud-push/cli](https://img.shields.io/badge/@cloud--push/cli-v1.1.3-blue)](https://www.npmjs.com/package/@cloud-push/expo)  
[![@cloud-push/utils](https://img.shields.io/badge/@cloud--push/utils-v1.1.3-blue)](https://www.npmjs.com/package/@cloud-push/next)  

## **Typescript Only, Zero kotlin, Zero Swift, Zero java, Zero Object-C**

**OTA Update solution compatible with Expo Updates**  
→ Self-hosted update distribution system

## 📚 Documentation

You can find the full usage guide and API reference in the  
👉 [**Cloud Push Docs**](https://doyoonkim12345.github.io/cloud-push/)

## 🚀 Motivation

Expo projects are highly customized React Native projects. Because of this, available CodePush solutions are limited.  
This project, inspired by [`hot-updater`](https://github.com/gronxb/hot-updater), offers an alternative way to manage bundles using storage services like S3, Firebase, Supabase, etc.  
It follows [Expo Updates technical specs](https://docs.expo.dev/technical-specs/expo-updates-1/) and maintains compatibility with Expo Updates.


## 🧪 Compatibility

- ✅ Works with `expo run:android --variant release`
- ✅ Works with `expo run:ios --configuration Release`
- ✅ Compatible with **Expo Managed Workflow**
## ✨ Key Features

- 📡 Self-hosted deployment supported
- 📦 Flexible storage & DB (S3, Supabase, Firebase, etc.)
- 🔄 Compatible with Expo Updates APIs
- 💾 Web-based bundle version dashboard
- 🌐 Supports expo.dev environment variables (via EAS Secrets)
- 🪟 Works on Windows
- 🧪 EAS build supported


## 🛠 Configuration Examples

### Supabase

```ts
import { defineConfig } from "@cloud-push/cli";
import { SupabaseStorageClient, SupabaseDbClient } from "@cloud-push/cloud";

export default defineConfig(() => ({
  loadClients: () => {

    const storageClient = new SupabaseStorageClient({
      bucketName: process.env.SUPABASE_BUCKET_NAME!,
      supabaseUrl: process.env.SUPABASE_URL!,
      supabaseKey: process.env.SUPABASE_KEY!,
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
}));
```

### AWS S3 + lowdb

```ts
import { defineConfig } from "@cloud-push/cli";
import { AWSS3StorageClient, LowDbClient } from "@cloud-push/cloud";

export default defineConfig(() => ({
  loadClients: () => {
    
    const storageClient = new AWSS3StorageClient({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      bucketName: process.env.AWS_BUCKET_NAME!,
      region: process.env.AWS_REGION!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    });

    const dbClient = new LowDbClient({
      downloadJSONFile: () => storageClient.getFile({ key: "cursor.json" }),
      uploadJSONFile: (file: Uint8Array) =>
        storageClient.uploadFile({ key: "cursor.json", file }),
    });

    return {
      storage: storageClient,
      db: dbClient,
    };
  },
}));
```

### Firebase

```ts
import { defineConfig } from "@cloud-push/cli";
import { FirebaseStorageClient, FirebaseDbClient } from "@cloud-push/cloud";

export default defineConfig(() => ({
  	loadClients: () => {
		const storageClient = new FirebaseStorageClient({
			credential: process.env.FIREBASE_CREDENTIAL!,
			bucketName: process.env.BUCKET_NAME!,
		});

		const dbClient = new FirebaseDbClient({
			credential: process.env.FIREBASE_CREDENTIAL!,
			databaseId: process.env.FIREBASE_DATABASE_ID!,
		});

		return {
			storage: storageClient,
			db: dbClient,
		};
	},
}));
```

## 📘 Expo Updates SDK Compatibility

### 🧱 Constants

| Constant                      | Supported |
|------------------------------|-----------|
| `Updates.channel`            | ✅        |
| `Updates.checkAutomatically` | ✅        |
| `Updates.createdAt`          | ✅        |
| `Updates.emergencyLaunchReason` | ⏳    |
| `Updates.isEmbeddedLaunch`   | ✅        |
| `Updates.isEmergencyLaunch`  | ⏳        |
| `Updates.isEnabled`          | ✅        |
| `Updates.latestContext`      | ✅        |
| `Updates.launchDuration`     | ✅        |
| `Updates.manifest`           | ✅        |
| `Updates.runtimeVersion`     | ✅        |
| `Updates.updateId`           | ✅        |

### 🧩 Hooks

| Hook           | Supported |
|----------------|-----------|
| `useUpdates()` | ✅        |

### 🛠 Methods

| Method                  | Supported |
|-------------------------|-----------|
| `checkForUpdateAsync()` | ✅        |
| `clearLogEntriesAsync()`| ✅        |
| `fetchUpdateAsync()`    | ✅        |
| `getExtraParamsAsync()` | ❌        |
| `readLogEntriesAsync()` | ✅        |
| `reloadAsync()`         | ✅        |
| `setExtraParamAsync()`  | ❌        |

---

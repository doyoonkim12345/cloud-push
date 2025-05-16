# Configs

## `cloud-push.server.ts`

```ts
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
```

서버(node) 환경에서 storageClient 또는 dbClient를 사용하는 경우 여기서 import 합니다.

## `cloud-push.browser.ts`

```ts
"use server";

import { generateBrowserClient } from "@cloud-push/next";
import { storageNodeClient, dbNodeClient } from "@/cloud-push.server";

export const storageBrowserClient = generateBrowserClient(storageNodeClient);
export const dbBrowserClient = generateBrowserClient(dbNodeClient);
```

서버(node) 전용 인스턴스를 browser에서 호출할 수 있도록 합니다.
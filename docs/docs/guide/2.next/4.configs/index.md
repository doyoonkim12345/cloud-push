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

Import storageClient or dbClient here when using them in a server (node) environment.

## `cloud-push.browser.ts`

```ts
"use server";

import { generateBrowserClient } from "@cloud-push/next";
import { storageNodeClient, dbNodeClient } from "@/cloud-push.server";

export const storageBrowserClient = generateBrowserClient(storageNodeClient);
export const dbBrowserClient = generateBrowserClient(dbNodeClient);
```

Makes server (node) only instances callable from the browser.

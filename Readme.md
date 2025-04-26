<p align="center">
  <img src="./logo.png" alt="Logo" width="300" />
</p>

**Expo Updates 호환 OTA Update 솔루션**  
→ Self-host 기반의 업데이트 배포 시스템  
 

## ✨ Key Features

- 📡 **Self-host** 가능
- 📦 **Custom Storage & DB** 지원 (S3, Supabase 등)
- 🔄 **Expo Updates API와 호환**
- 💾 **번들 버전 관리 대시보드** 제공 (웹 기반)
- 🌐 **expo.dev 환경변수 지원** (EAS Secrets 연동)
- 🪟 **Windows 사용 가능** (`cloud-push`는 Windows 환경에서도 작동)


## ⚙️ Quick Start

### 1️⃣ CLI 패키지 설치

```bash
pnpm add @cloud-push/cli
```

---

### 2️⃣ 초기 설정 파일 생성

```bash
pnpm cloud-push init
```

- `cloud-push.config.ts` 파일이 생성되며, 아래 항목들을 작성해야 합니다:
  - `runtimeVersion` (선택)
  - `storage`: 번들 저장소 클라이언트
  - `db`: 메타데이터 저장소 클라이언트

---

### 3️⃣ 환경 변수 입력

`.env` 또는 **EAS Secrets**를 통해 다음과 같은 환경 변수를 설정하세요:

```
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_BUCKET_NAME=...
...
```

> ✅ 사용 환경에 따라 AWS, Supabase, Firebase 등 각 클라이언트에 필요한 값을 입력하세요.

---

### 4️⃣ 업데이트 배포 실행

```bash
pnpm cloud-push deploy
```

> 💡 `runtimeVersion`이 설정된 경우, 해당 버전 간에만 업데이트가 적용됩니다.


---

## ⚠️ 로컬 테스트 시 주의사항 (Android)

`HTTP` 요청을 허용하려면 `app.config.ts`에 `usesCleartextTraffic` 옵션을 추가해야 합니다:

```ts
export default {
  expo: {
    name: "your-app-name",
    slug: "your-app-slug",
    plugins : [
      ...플러그인들
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
          ios: {},
        },
      ],
  ]
  },
};
```

---

## ⚙️ cloud-push.config 타입 정의

```ts
type Config = {
  runtimeVersion?: string; // 빌드 간 버전 동기화
  storage: StorageClient;   // 번들 저장소
  db: DbClient;             // 버전 메타데이터 저장소
};
```

- `runtimeVersion`: Expo와 동일하게 **같은 runtimeVersion끼리만 업데이트 호환**
- `storage`: 지원: `AWS S3`, `Cloudflare R2`, `Supabase`, `Custom`
- `db`: 지원: `lowdb (JSON)`, `Supabase`, `Custom`

---

## 🛠 설정 예시

### Supabase 사용 예시

```ts
import { defineConfig } from "@cloud-push/react-native";
import { SupabaseStorageClient, SupabaseDbClient } from "@cloud-push/cloud";
import version from "./version";

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

export default defineConfig(() => ({
  runtimeVersion: version.runtimeVersion,
  storage: storageClient,
  db: dbClient,
}));
```
### AWS S3 & lowdb 사용 예시
```ts
import { defineConfig } from "@cloud-push/react-native";
import { AWSS3StorageClient, LowDbClient } from "@cloud-push/cloud";
import version from "./version";

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
  runtimeVersion: version.runtimeVersion,
  storage: storageClient,
  db: dbClient,
}));
```
### Firebase 사용 예시
```ts
import { defineConfig } from "@cloud-push/react-native";
import { FirebaseStorageClient, FirebaseDbClient } from "@cloud-push/cloud";
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
  runtimeVersion: version.runtimeVersion,
  storage: storageClient,
  db: dbClient,
}));
```

---

# 📘 Expo Updates SDK 메서드 지원 현황

## 🧱 Constants

| 상수명                         | 지원 여부 |
|--------------------------------|-----------|
| `Updates.channel`              | ❌ 미지원 |
| `Updates.checkAutomatically`   | ✅ 지원   |
| `Updates.createdAt`            | ✅ 지원   |
| `Updates.emergencyLaunchReason`| ⏳ 확인 중 |
| `Updates.isEmbeddedLaunch`     | ✅ 지원   |
| `Updates.isEmergencyLaunch`    | ⏳ 확인 중 |
| `Updates.isEnabled`            | ✅ 지원   |
| `Updates.latestContext`        | ✅ 지원   |
| `Updates.launchDuration`       | ✅ 지원   |
| `Updates.manifest`             | ✅ 지원   |
| `Updates.runtimeVersion`       | ✅ 지원   |
| `Updates.updateId`             | ✅ 지원   |

---

## 🧩 Hooks

| 훅             | 지원 여부 |
|----------------|-----------|
| `useUpdates()` | ⏳ 확인 중 |

---

## 🛠 Methods

| 메서드명                      | 지원 여부 |
|-------------------------------|-----------|
| `checkForUpdateAsync()`       | ✅ 지원   |
| `clearLogEntriesAsync()`      | ✅ 지원   |
| `fetchUpdateAsync()`          | ✅ 지원   |
| `getExtraParamsAsync()`       | ❌ 미지원 |
| `readLogEntriesAsync()`       | ✅ 지원   |
| `reloadAsync()`               | ✅ 지원   |
| `setExtraParamAsync()`        | ❌ 미지원 |
```


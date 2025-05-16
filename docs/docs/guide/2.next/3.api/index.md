# Api

## `/api/updates/manifest`

이 api는 [`Expo Updates Protocol v1`](https://docs.expo.dev/technical-specs/expo-updates-1/) 명세를 기반으로, 클라이언트가 서버로 OTA 업데이트를 요청할 때 전달하는 메타데이터의 구조를 설명합니다.  
클라이언트는 `Header` 또는 `Query Parameter`를 통해 다양한 정보를 전달합니다.

## 📥 요청 필드 요약

| 필드명              | 위치            | 키 이름                        | 필수 여부 | 설명 |
|---------------------|------------------|-------------------------------|-----------|------|
| `runtimeVersion`     | Header           | `expo-runtime-version`         | ✅         | 앱 런타임 버전. 필수입니다. |
|                     | Query Param      | `runtime-version`              |           | Header가 없는 경우 fallback |
| `platform`           | Header           | `expo-platform`                | ✅         | 플랫폼 정보 (`ios`, `android`) |
|                     | Query Param      | `platform`                     |           | Header가 없는 경우 fallback |
| `protocolVersion`    | Header           | `expo-protocol-version`        | ✅         | Expo Updates 프로토콜 버전 (정수) |
| `channel`            | Header           | `expo-channel-name`            | ❌         | 업데이트 채널 이름 (예: `development`) |
| `embeddedUpdateId`   | Header           | `expo-embedded-update-id`      | ❌         | 앱에 내장된 업데이트 ID |
| `currentUpdateId`    | Header           | `expo-current-update-id`       | ❌         | 현재 실행 중인 업데이트 ID |

<Callout type="info">
  `runtimeVersion`, `platform`, `protocolVersion`는 업데이트 요청을 식별하는 데 필수입니다.
</Callout>

## 🧪 동작 우선순위

`runtimeVersion`과 `platform` 값은 다음 우선순위로 처리됩니다:

1. **Header 값이 우선**: `expo-runtime-version`, `expo-platform`
2. **없을 경우**: `runtime-version`, `platform` 쿼리 파라미터에서 대체

## 📦 예시 요청

```http
GET /api/manifest?platform=android&runtime-version=1.0.0 HTTP/1.1
Host: example.com
expo-platform: android
expo-runtime-version: 1.0.0
expo-protocol-version: 1
expo-channel-name: development
expo-current-update-id: 123e4567-e89b-12d3-a456-426614174000
expo-embedded-update-id: 123e4567-e89b-12d3-a456-426614174999
```

## `/api/updates/status`

이 api는 업데이트는 현재 번들의 상태를 확인합니다. 

## 📥 요청 필드 요약

| 필드명              | 위치            | 키 이름                        | 필수 여부 | 설명 |
|---------------------|------------------|-------------------------------|-----------|------|
| `currentUpdateId`    | Header           | `expo-current-update-id`       | ✅         | 현재 실행 중인 업데이트 ID |

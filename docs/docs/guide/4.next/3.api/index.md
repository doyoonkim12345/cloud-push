# Api

## `/api/updates/manifest`

This API is based on the [`Expo Updates Protocol v1`](https://docs.expo.dev/technical-specs/expo-updates-1/) specification and describes the structure of metadata that clients send when requesting OTA updates from the server.  
Clients can send various information through `Header` or `Query Parameter`.

## 📥 Request Fields Summary

| Field Name         | Location    | Key Name                  | Required | Description                               |
| ------------------ | ----------- | ------------------------- | -------- | ----------------------------------------- |
| `runtimeVersion`   | Header      | `expo-runtime-version`    | ✅       | App runtime version. Required.            |
|                    | Query Param | `runtime-version`         |          | Fallback if Header is missing             |
| `platform`         | Header      | `expo-platform`           | ✅       | Platform information (`ios`, `android`)   |
|                    | Query Param | `platform`                |          | Fallback if Header is missing             |
| `protocolVersion`  | Header      | `expo-protocol-version`   | ✅       | Expo Updates protocol version (integer)   |
| `channel`          | Header      | `expo-channel-name`       | ❌       | Update channel name (e.g., `development`) |
| `embeddedUpdateId` | Header      | `expo-embedded-update-id` | ❌       | Update ID embedded in the app             |
| `currentUpdateId`  | Header      | `expo-current-update-id`  | ❌       | Currently running update ID               |

<Callout type="info">
  `runtimeVersion`, `platform`, and `protocolVersion` are required to identify update requests.
</Callout>

## 🧪 Processing Priority

`runtimeVersion` and `platform` values are processed in the following priority:

1. **Header values take precedence**: `expo-runtime-version`, `expo-platform`
2. **If missing**: Fallback to `runtime-version`, `platform` query parameters

## 📦 Example Request

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

This API checks the status of the current bundle update.

## 📥 Request Fields Summary

| Field Name        | Location | Key Name                 | Required | Description                 |
| ----------------- | -------- | ------------------------ | -------- | --------------------------- |
| `currentUpdateId` | Header   | `expo-current-update-id` | ✅       | Currently running update ID |

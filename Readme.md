expo는 새로운 react-native의 표준입니다. expo는

사용법

1. @cloud-push/cli 설치
2. cloud-push.config 생성 => 설정
3. eas init 초기화
4. version.js 생성
5. app.config.js / cloud-push.config version 추가
6. expo 서버에 환경변수 입력
7. cloud-push deploy

expo-updates 사용 가능 메소드

# Expo Updates SDK 메소드 요약

## 상수 (Constants)

| 상수명                                                                                                             | 지원 여부  |
| ------------------------------------------------------------------------------------------------------------------ | ---------- |
| [`Updates.channel`](https://docs.expo.dev/versions/latest/sdk/updates/#updateschannel)                             | ❌ 미지원  |
| [`Updates.checkAutomatically`](https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckautomatically)       | ✅ 지원    |
| [`Updates.createdAt`](https://docs.expo.dev/versions/latest/sdk/updates/#updatescreatedat)                         | ✅ 지원    |
| [`Updates.emergencyLaunchReason`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesemergencylaunchreason) | 확인 안 됨 |
| [`Updates.isEmbeddedLaunch`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesisembeddedlaunch)           | ✅ 지원    |
| [`Updates.isEmergencyLaunch`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesisemergencylaunch)         | 확인 안 됨 |
| [`Updates.isEnabled`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesisenabled)                         | ✅ 지원    |
| [`Updates.latestContext`](https://docs.expo.dev/versions/latest/sdk/updates/#updateslatestcontext)                 | ✅ 지원    |
| [`Updates.launchDuration`](https://docs.expo.dev/versions/latest/sdk/updates/#updateslaunchduration)               | ✅ 지원    |
| [`Updates.manifest`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesmanifest)                           | ✅ 지원    |
| [`Updates.runtimeVersion`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesruntimeversion)               | ✅ 지원    |
| [`Updates.updateId`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesupdateid)                           | ✅ 지원    |

## 훅 (Hooks)

| 훅                                                                              | 지원 여부 |
| ------------------------------------------------------------------------------- | --------- |
| [`useUpdates()`](https://docs.expo.dev/versions/latest/sdk/updates/#useupdates) |           |

## 메소드 (Methods)

| 메소드명                                                                                                           | 지원 여부 |
| ------------------------------------------------------------------------------------------------------------------ | --------- |
| [`Updates.checkForUpdateAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckforupdateasync)   | ✅ 지원   |
| [`Updates.clearLogEntriesAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesclearlogentriesasync) | ✅ 지원   |
| [`Updates.fetchUpdateAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesfetchupdateasync)         | ✅ 지원   |
| [`Updates.getExtraParamsAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesgetextraparamsasync)   | ❌ 미지원 |
| [`Updates.readLogEntriesAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesreadlogentriesasync)   | ✅ 지원   |
| [`Updates.reloadAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatesreloadasync)                   | ✅ 지원   |
| [`Updates.setExtraParamAsync()`](https://docs.expo.dev/versions/latest/sdk/updates/#updatessetextraparamasync)     | ❌ 미지원 |

import { selectPlatforms } from "../commands/selectPlatforms";
import { selectEnvironment } from "../commands/selectEnvironment";
import { selectEnvSource } from "../commands/selectEnvSource";
import { loadConfig } from "@/lib/loadConfig";
import { getRuntimeVersion } from "../commands/getRuntimeVersion";
import { exportBundles } from "../commands/exportBundles";
import { exportExpoConfig } from "../commands/exportExpoConfig";
import { v4 as uuidv4 } from "uuid";
import type { Config } from "@/config";
import { loadEnv } from "@/commands/loadEnv";
import type { Environment, Platform } from "@cloud-push/core";
import { getGitCommitHash } from "@/commands/getGitCommitHash";

export async function setupDeployment(bundlePath: string) {
	// 1. 플랫폼 선택
	const platforms: Platform[] = await selectPlatforms();

	// 2. 환경 선택
	const environment: Environment = await selectEnvironment();

	// 3. 환경 소스 선택
	const envSource = await selectEnvSource();

	// 4. 환경 변수 로드
	await loadEnv(envSource, environment);

	// 5. 설정 로드
	const config: Config = await loadConfig();

	// 6. 런타임 버전 가져오기
	const runtimeVersion: string = await getRuntimeVersion(config.runtimeVersion);

	// 7. 번들 내보내기
	await exportBundles({ platforms, bundlePath, environment });

	// 8. Expo 설정 내보내기
	await exportExpoConfig({ expoConfigPath: bundlePath });

	// 9. 번들 ID 생성
	const bundleId: string = uuidv4();

	// 10. S3 키 생성
	const cloudPath: string = `${runtimeVersion}/${environment}/${bundleId}`;

	const gitHash = await getGitCommitHash();

	return {
		bundleId,
		cloudPath,
		platforms,
		environment,
		runtimeVersion,
		dbClient: config.db,
		storageClient: config.storage,
		envSource,
		gitHash,
	};
}

import { selectPlatforms } from "@/expo/commands/selectPlatforms";
import { selectEnvSource } from "@/expo/commands/selectEnvSource";
import { getRuntimeVersion } from "@/expo/commands/getRuntimeVersion";
import { exportBundles } from "@/expo/commands/exportBundles";
import { exportExpoConfig } from "@/expo/commands/exportExpoConfig";
import { loadEnv } from "@/expo/commands/loadEnv";
import type { Environment, Platform } from "@cloud-push/cloud";
import { getGitCommitHash } from "@/expo/commands/getGitCommitHash";
import { getChannel } from "@/expo/commands/getChannel";
import { getRepositoryUrl } from "@/expo/commands/getRepositoryUrl";
import { selectEnvironment } from "@/expo/commands/selectEnvironment";
import { loadConfig } from "@/expo/lib/loadConfig";
import type { CliConfig } from "@/expo/config";
import { v4 } from "uuid";
import { signBundle } from "../commands/signBundle";

export async function setupDeployment(bundlePath: string) {
	// 5. 설정 로드
	const config: CliConfig = await loadConfig();

	// 1. 플랫폼 선택
	const platforms: Platform[] = await selectPlatforms();

	// 2. 환경 선택
	const environment: Environment = await selectEnvironment(config.environment);

	// 3. 환경 소스 선택
	const envSource = await selectEnvSource(config.envSource);

	// 4. 환경 변수 로드
	await loadEnv(envSource, environment);

	const clients = config.loadClients();

	const channel = await getChannel(config.channel);

	// 6. 런타임 버전 가져오기
	const runtimeVersion: string = await getRuntimeVersion(config.runtimeVersion);

	// 7. 번들 내보내기
	await exportBundles({ platforms, bundlePath, environment });

	if (config.privateKeyPath) {
		signBundle({
			privateKeyPath: config.privateKeyPath,
		});
	}

	// 8. Expo 설정 내보내기
	await exportExpoConfig({ expoConfigPath: bundlePath });

	// 9. 번들 ID 생성
	const bundleId: string = v4();

	// 10. S3 키 생성
	const cloudPath: string = `${runtimeVersion}/${environment}/${bundleId}`;

	// 11. gitHash 가져오기
	const gitHash = await getGitCommitHash();

	// 12. git repository url 가져오기
	const gitRepositoryUrl = await getRepositoryUrl();

	return {
		bundleId,
		cloudPath,
		platforms,
		environment,
		runtimeVersion,
		dbClient: clients.db,
		storageClient: clients.storage,
		envSource,
		gitHash,
		gitRepositoryUrl,
		channel,
	};
}

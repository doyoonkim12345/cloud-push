import * as prompts from "@clack/prompts";
import * as path from "node:path";
import { setupDeployment } from "@/lib/setupDeployment";
import { type DeploymentConfig, uploadBundle } from "./uploadBundle";
import { updateVersionCursor } from "./updateCursor";
import { cleanup } from "@/lib/cleanup";
import { getCwd } from "@cloud-push/core";

export async function deploy(): Promise<void> {
	const cwd = getCwd();
	const bundlePath = path.resolve(cwd, "./dist");

	try {
		// 1. 배포 설정 단계
		const deploymentConfig: DeploymentConfig =
			await setupDeployment(bundlePath);

		// 2. 번들 업로드 단계
		await uploadBundle(deploymentConfig, bundlePath);

		// 3. 버전 커서 업데이트 단계
		await updateVersionCursor(deploymentConfig);

		prompts.outro("🚀 Deployment Successful");
		prompts.note(
			JSON.stringify(
				{
					bundleId: deploymentConfig.bundleId,
					runtimeVersion: deploymentConfig.runtimeVersion,
					platforms: deploymentConfig.platforms,
					cloudPath: deploymentConfig.cloudPath,
					environment: deploymentConfig.environment,
					envSource: deploymentConfig.envSource,
				},
				null,
				2,
			),
		);
	} catch (e) {
		console.error(e);
		prompts.outro("Deployment failed");
	} finally {
		// 정리 단계
		await cleanup(bundlePath);
	}
}

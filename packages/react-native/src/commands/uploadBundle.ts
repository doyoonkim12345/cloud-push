import type { Config } from "@/config";
import type { ENV_SOURCE } from "@/features/env/types";
import * as prompts from "@clack/prompts";
import type { Environment, Platform } from "@cloud-push/core";

export interface DeploymentConfig {
	bundleId: string;
	cloudPath: string;
	platforms: Platform[];
	environment: Environment;
	runtimeVersion: string;
	config: Config;
	envSource: ENV_SOURCE;
}

export async function uploadBundle(
	deploymentConfig: DeploymentConfig,
	bundlePath: string,
): Promise<void> {
	const { cloudPath, config } = deploymentConfig;
	const spinner = prompts.spinner();

	spinner.start("Preparing file upload...");

	try {
		const storageClient = config.storage;
		await storageClient.uploadDirectory({
			cloudPath,
			directoryPath: bundlePath,
		});

		spinner.stop("✅ Uploading completed successfully!");
	} catch (e) {
		spinner.stop(`❌ Uploading failed: ${(e as Error).message}`);
		throw e; // 상위 호출자에게 오류 전파
	}
}

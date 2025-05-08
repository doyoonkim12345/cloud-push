import type { Config } from "@/config";
import * as prompts from "@clack/prompts";
import type { StorageClient } from "@cloud-push/cloud";
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

export async function uploadBundle({
	cloudPath,
	directoryPath,
	storageClient,
}: {
	storageClient: StorageClient;
	cloudPath: string;
	directoryPath: string;
}): Promise<void> {
	const spinner = prompts.spinner();

	spinner.start("Preparing file upload...");

	try {
		await storageClient.uploadDirectory({
			cloudPath,
			directoryPath,
		});

		spinner.stop("✅ Uploading completed successfully!");
	} catch (e) {
		spinner.stop(`❌ Uploading failed: ${(e as Error).message}`);
		throw e; // 상위 호출자에게 오류 전파
	}
}

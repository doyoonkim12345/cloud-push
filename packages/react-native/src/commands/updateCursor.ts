import * as prompts from "@clack/prompts";
import type { DeploymentConfig } from "./uploadBundle";

export async function updateVersionCursor(
	deploymentConfig: DeploymentConfig,
): Promise<void> {
	const { bundleId, environment, platforms, runtimeVersion, config } =
		deploymentConfig;
	const cursorSpinner = prompts.spinner();

	cursorSpinner.start("Version cursor updating...");
	const dbClient = await config.db;

	await dbClient.init?.();

	try {
		await dbClient.create({
			bundle: {
				bundleId,
				createdAt: Date.now(),
				environment,
				gitHash: "",
				supportAndroid: platforms.includes("android"),
				supportIos: platforms.includes("ios"),
				runtimeVersion,
				updatePolicy: "NORMAL_UPDATE",
			},
		});

		await dbClient.sync?.();

		cursorSpinner.stop("✅ Updating version cursor completed successfully!");
	} catch (e) {
		cursorSpinner.stop(
			`❌ Uploading version cursor failed: ${(e as Error).message}`,
		);
		throw e; // 상위 호출자에게 오류 전파
	}
}

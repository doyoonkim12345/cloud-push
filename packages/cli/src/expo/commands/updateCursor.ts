import * as prompts from "@clack/prompts";
import type { Environment, Platform } from "@cloud-push/cloud";
import type { DbClient } from "@cloud-push/cloud";

export async function updateVersionCursor({
	bundleId,
	environment,
	channel,
	platforms,
	runtimeVersion,
	gitHash,
	dbClient,
}: {
	bundleId: string;
	environment: Environment;
	channel: string;
	platforms: Platform[];
	runtimeVersion: string;
	gitHash: string;
	dbClient: DbClient;
}): Promise<void> {
	const cursorSpinner = prompts.spinner();

	cursorSpinner.start("Version cursor updating...");

	await dbClient.init?.();

	try {
		await dbClient.create({
			bundle: {
				bundleId,
				createdAt: Date.now(),
				environment,
				gitHash,
				supportAndroid: platforms.includes("android"),
				supportIos: platforms.includes("ios"),
				runtimeVersion,
				channel,
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

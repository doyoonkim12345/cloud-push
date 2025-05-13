import * as prompts from "@clack/prompts";
import * as path from "node:path";
import { setupDeployment } from "@/lib/setupDeployment";
import { uploadBundle } from "./uploadBundle";
import { updateVersionCursor } from "./updateCursor";
import { cleanup } from "@/lib/cleanup";
import { getCwd } from "@cloud-push/core/node";
import { getCommitUrl } from "@cloud-push/core";
import { updateSetting } from "./updateSetting";

export async function deploy(): Promise<void> {
	const cwd = getCwd();
	const bundlePath = path.resolve(cwd, "./dist");

	try {
		// 1. 배포 설정 단계
		const {
			cloudPath,
			storageClient,
			bundleId,
			dbClient,
			environment,
			gitHash,
			gitRepositoryUrl,
			platforms,
			runtimeVersion,
			envSource,
			channel,
		} = await setupDeployment(bundlePath);

		// 2. 번들 업로드 단계
		await uploadBundle({ cloudPath, directoryPath: bundlePath, storageClient });

		// 3. 버전 커서 업데이트 단계
		await updateVersionCursor({
			bundleId,
			dbClient,
			environment,
			gitHash,
			platforms,
			runtimeVersion,
			channel,
		});

		await updateSetting({
			storageClient,
			gitRepositoryUrl,
			channel,
		});

		prompts.outro("🚀 Deployment Successful");
		prompts.note(
			JSON.stringify(
				{
					bundleId,
					runtimeVersion,
					platforms,
					cloudPath,
					environment,
					channel,
					envSource,
					gitCommit: getCommitUrl({ repositoryUrl: gitRepositoryUrl, gitHash }),
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

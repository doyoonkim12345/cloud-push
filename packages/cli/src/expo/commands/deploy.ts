import * as prompts from "@clack/prompts";
import * as path from "node:path";
import { uploadBundle } from "./uploadBundle";
import { updateVersionCursor } from "./updateCursor";
import { getCwd } from "@cloud-push/cloud";
import { updateSetting } from "./updateSetting";
import { getCommitUrl } from "@cloud-push/utils";
import { setupDeployment } from "@/expo/lib/setupDeployment";
import { cleanup } from "@/expo/lib/cleanup";
import { updateBranchCursor } from "./updateBranchCursor";

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
			branch,
			message,
			updateId
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
			message,
			branch,
			updateId,
		});

		await updateSetting({
			storageClient,
			gitRepositoryUrl,
			channel,
		});

		await updateBranchCursor({
			storageClient,
			channel,
			branch,
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
					gitCommit: gitHash ? getCommitUrl({ repositoryUrl: gitRepositoryUrl, gitHash }) : null
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
		// await cleanup(bundlePath);
	}
}

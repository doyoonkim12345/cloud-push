import type { StorageClient } from "@cloud-push/cloud";
import { createJsonUint8Array, type Setting } from "@cloud-push/core";
import * as prompts from "@clack/prompts";

export const uploadSetting = async ({
	storageClient,
	setting,
}: { storageClient: StorageClient; setting: Setting }) => {
	const spinner = prompts.spinner();

	spinner.start("Preparing Setting file upload...");

	try {
		const settingJson = createJsonUint8Array<Setting>(setting);
		await storageClient.uploadFile({ key: "setting.json", file: settingJson });

		spinner.stop("✅ Uploading Setting completed successfully!");
	} catch (e) {
		spinner.stop(`❌ Uploading Setting failed: ${(e as Error).message}`);
		throw e; // 상위 호출자에게 오류 전파
	}
};

import type { StorageClient } from "@cloud-push/cloud";
import {
	createJsonUint8Array,
	parseFileAsJson,
	type Setting,
} from "@cloud-push/core";
import * as prompts from "@clack/prompts";

export const updateSetting = async ({
	storageClient,
	gitRepositoryUrl,
	channel,
}: {
	storageClient: StorageClient;
	gitRepositoryUrl: string;
	channel: string;
}) => {
	const spinner = prompts.spinner();

	spinner.start("Preparing Setting file upload...");

	try {
		let setting: Setting;

		try {
			const settingJson = await storageClient.getFile({ key: "setting.json" });
			setting = parseFileAsJson<Setting>(settingJson);
		} catch (e) {
			setting = { channels: [channel], repositoryUrl: gitRepositoryUrl };
		}

		const newSettingJson = createJsonUint8Array<Setting>({
			...setting,
			repositoryUrl: gitRepositoryUrl,
			channels: [...new Set([...setting.channels, channel])],
		});
		await storageClient.uploadFile({
			key: "setting.json",
			file: newSettingJson,
		});

		spinner.stop("✅ Uploading Setting completed successfully!");
	} catch (e) {
		spinner.stop(`❌ Uploading Setting failed: ${(e as Error).message}`);
		throw e; // 상위 호출자에게 오류 전파
	}
};

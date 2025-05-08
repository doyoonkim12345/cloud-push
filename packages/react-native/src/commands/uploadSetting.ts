import type { StorageClient } from "@cloud-push/cloud";
import { createJsonUint8Array } from "@cloud-push/core";

interface Setting {
	repositoryUrl: string;
}

export const uploadSetting = async ({
	storageClient,
	setting,
}: { storageClient: StorageClient; setting: Setting }) => {
	const settingJson = createJsonUint8Array<{ repositoryUrl: string }>(setting);
	await storageClient.uploadFile({ key: "setting.json", file: settingJson });
};

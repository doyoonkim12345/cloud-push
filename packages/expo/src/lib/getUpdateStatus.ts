import { loadConfig } from "./loadConfig";
import type { UpdateStatus } from "@cloud-push/core";

export async function getUpdateStatus(updateId: string) {
	const config = await loadConfig();

	if (config.checkStatusUrl) {
		const headers = new Headers();
		headers.append("expo-current-update-id", updateId);
		const response = await fetch(config.checkStatusUrl, { headers });
		const status = await response.json();
		return status as UpdateStatus;
	}
	throw new Error("Failedt to load checkStatusUrl");
}

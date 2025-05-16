import * as Updates from "expo-updates";
import type { UpdateStatus } from "@cloud-push/cloud";
import { getConfig } from "./getConfig";

export async function getUpdateStatus() {
	const config = getConfig()

	if(!config.checkUpdateStatusUrl){
		throw new Error("Failed to load checkStatusUrl");
	}

	if(!Updates.updateId){
		throw new Error('Failed to load updateId')
	}

	if (config.checkUpdateStatusUrl) {
		const headers = new Headers();
		headers.append("expo-current-update-id", Updates.updateId);
		const response = await fetch(config.checkUpdateStatusUrl, { headers });
		const status = await response.json();
		return status as UpdateStatus;
	}

}

import type { NextRequest } from "next/server";
import {
	storageNodeClient,
} from "@/cloud-push.server";
import {
	ErrorResponse,
	type Manifest,
	NoUpdateResponse,
	parseHeaders,
	UpdateResponse,
} from "@cloud-push/next";
import { ExpoClient } from "@cloud-push/cloud";
import { parseFileAsJson, type BranchMetadata } from "@cloud-push/cli";
import * as path from "node:path";

export async function GET(request: NextRequest) {

	try {
		const {
			currentUpdateId,
			embeddedUpdateId,
			channel,
			platform,
			protocolVersion,
			runtimeVersion,
			expectSignature,
		} = parseHeaders({
			headers: request.headers,
			url: new URL(request.url),
		});


		if (
			!runtimeVersion ||
			!platform ||
			!protocolVersion ||
			!embeddedUpdateId ||
			!channel
		) {
			console.log("Not Enough Params", {
				runtimeVersion,
				platform,
				protocolVersion,
				embeddedUpdateId,
				currentUpdateId,
				channel,
			})
			return ErrorResponse(new Error("Not Enough Params"));
		}

		const expoAppId = process.env.EXPO_APP_ID!;
		const expoToken = process.env.EXPO_TOKEN!;

		if (!expoAppId || !expoToken) {
			return ErrorResponse(new Error("Expo App ID or Token is not set"));
		}

		const expoClient = new ExpoClient({
			appId: expoAppId,
			token: expoToken,
		});

		const channelMapping = await expoClient.getChannelMapping(channel)

		const branchId = channelMapping?.branchMapping.data[0].branchId


		if (!branchId) {
			return ErrorResponse(new Error("Branch ID not found"))
		}

		const branchMetadataJson = await storageNodeClient.getFile({ key: path.join(branchId, "metadata.json") })
		const branchMetadata = parseFileAsJson<BranchMetadata>(branchMetadataJson)

		const pushId: string | undefined = branchMetadata.pushes[0].id

		if (pushId) {
			if (pushId !== currentUpdateId) {

				const manifestJson = await storageNodeClient.getFile({
					key: path.join(branchId, pushId, `manifest-${platform}.json`)
				})

				const manifest = parseFileAsJson<Manifest>(manifestJson)

				return UpdateResponse({
					updateId: pushId,
					manifest,
				})
			}
		}
		return NoUpdateResponse()
	} catch (error) {
		return ErrorResponse(error as Error);
	}
}

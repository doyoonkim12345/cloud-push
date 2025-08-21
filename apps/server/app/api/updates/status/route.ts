import type { NextRequest } from "next/server";
import { ErrorResponse, parseHeaders, StatusResponse } from "@cloud-push/next";
import { storageNodeClient } from "@/cloud-push.server";
import { ExpoClient } from "@cloud-push/cloud";
import path from "node:path";

export async function GET(request: NextRequest) {
	try {
		const { currentUpdateId, channel } = parseHeaders({
			headers: request.headers,
			url: new URL(request.url),
		});

		if (!currentUpdateId || !channel) {
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


		const bundle = await expoClient.getChannelMapping(channel)
		const branchMetadataJson = await storageNodeClient.getFile({ key: path.join(bundle.id, "metadata.json") })

		return StatusResponse({});
	} catch (error) {
		return ErrorResponse(error as Error);
	}
}

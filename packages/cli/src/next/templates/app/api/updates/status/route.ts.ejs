import type { NextRequest } from "next/server";
import { dbNodeClient } from "@/cloud-push.server";
import { ErrorResponse, parseHeaders, StatusResponse } from "@cloud-push/next";

export async function GET(request: NextRequest) {
	try {
		const { currentUpdateId } = parseHeaders({
			headers: request.headers,
			url: new URL(request.url),
		});

		if (!currentUpdateId) {
			return ErrorResponse(new Error("Not Enough Params"));
		}

		await dbNodeClient.init?.();

		const currentBundle = await dbNodeClient.find({
			conditions: { bundleId: currentUpdateId },
		});

		return StatusResponse({
			status: {
				isForceUpdateRequired: currentBundle?.updatePolicy === "FORCE_UPDATE",
			},
		});
	} catch (error) {
		return ErrorResponse(error as Error);
	}
}

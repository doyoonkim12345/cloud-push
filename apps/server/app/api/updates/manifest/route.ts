import type { NextRequest } from "next/server";
import type { Bundle } from "@cloud-push/cloud";
import { dbNodeClient, storageNodeClient } from "@/cloud-push.server";
import { createManifest } from "@cloud-push/next/node";
import {
	type Directive,
	ErrorResponse,
	findRollbackTargetBundle,
	findUpdateTargetBundle,
	NoUpdateResponse,
	parseHeaders,
	UpdateResponse,
} from "@cloud-push/next";

export async function GET(request: NextRequest) {
	try {
		const {
			currentUpdateId,
			embeddedUpdateId,
			channel,
			platform,
			protocolVersion,
			runtimeVersion,
		} = parseHeaders({
			headers: request.headers,
			url: new URL(request.url),
		});

		if (
			!runtimeVersion ||
			!platform ||
			!protocolVersion ||
			!embeddedUpdateId ||
			!currentUpdateId ||
			!channel
		) {
			return ErrorResponse(new Error("Not Enough Params"));
		}

		await dbNodeClient.init?.();

		const currentBundle = await dbNodeClient.find({
			conditions: { bundleId: currentUpdateId },
		});

		let nextBundle: Bundle | null;

		const isEmbedded = !currentBundle;

		const bundles = await dbNodeClient.findAll({
			conditions: {
				runtimeVersion,
				channel,
				supportAndroid: platform === "android" ? true : undefined,
				supportIos: platform === "ios" ? true : undefined,
			},
			sortOptions: [{ direction: "desc", field: "createdAt" }],
		});

		if (isEmbedded) {
			// latest
			nextBundle = bundles[0] ?? null;
		} else {
			switch (currentBundle?.updatePolicy) {
				case "FORCE_UPDATE":
				case "NORMAL_UPDATE":
					nextBundle = findUpdateTargetBundle(bundles, currentUpdateId) ?? null;
					break;
				case "ROLLBACK":
					nextBundle =
						findRollbackTargetBundle(bundles, currentUpdateId) ?? null;
					break;
				default:
					nextBundle = null;
					break;
			}
		}

		if (!nextBundle) {
			const directive: Directive = {
				type: "rollBackToEmbedded",
			};
			return UpdateResponse({ bundleId: embeddedUpdateId, directive });
		}

		if (nextBundle.bundleId === currentBundle?.bundleId) {
			return NoUpdateResponse();
		}

		const manifest = await createManifest({
			bundleId: nextBundle.bundleId,
			platform,
			runtimeVersion,
			storageClient: storageNodeClient,
			channel,
		});

		return UpdateResponse({ manifest, bundleId: nextBundle.bundleId });
	} catch (error) {
		return ErrorResponse(error as Error);
	}
}

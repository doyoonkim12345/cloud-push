import { createHash } from "@/features/hash/lib/createHash";
import getBase64URLEncoding from "@/features/helpers/lib/getBase64URLEncoding";
import { NoUpdateAvailableError } from "@/features/helpers/lib/getLatestUpdateBundlePathForRuntimeVersionAsync";
import type { ExpoMetadata } from "@/features/versions/types";
import putNoUpdateAvailableInResponseAsync from "@/features/updates/lib/putNoUpdateAvailableInResponseAsync";
import type { NextRequest } from "next/server";
import mime from "mime";
import FormData from "form-data";
import { dbNodeClient, storageNodeClient } from "@/features/api/nodeClient";
import { parseFileAsJson } from "@cloud-push/core/utils";
import type { Environment, Platform } from "@cloud-push/core";
import type { ExpoConfig } from "@expo/config-types";
import type { Bundle } from "@cloud-push/cloud";
import { findRollbackTargetBundle } from "@/features/versions/utils/findRollbackTargetBundle";
import { findUpdateTargetBundle } from "@/features/versions/utils/findUpdateTargetBundle";

type Manifest = {
	id: string;
	createdAt: string;
	runtimeVersion: string;
	launchAsset: Asset;
	assets: Asset[];
	metadata: { [key: string]: string };
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	extra: { [key: string]: any };
};

type Asset = {
	hash?: string;
	key: string;
	contentType: string;
	fileExtension?: string;
	url: string;
};

export async function GET(request: NextRequest) {
	// runtimeVersion
	const runtimeVersionFromHeader = request.headers.get("expo-runtime-version");
	const runtimeVersionFromQuery =
		request.nextUrl.searchParams.get("runtime-version");
	const runtimeVersion = runtimeVersionFromHeader ?? runtimeVersionFromQuery;

	// platform
	const platformFromHeader = request.headers.get("expo-platform");
	const platformFromQuery = request.nextUrl.searchParams.get("platform");
	const platform = (platformFromHeader ?? platformFromQuery) as Platform | null;

	// protocolVersion
	const protocolVersionHeader = request.headers.get("expo-protocol-version");
	const protocolVersion = parseInt(protocolVersionHeader ?? "0", 10);

	// environment
	const environment = request.headers.get(
		"cloud-push-environment",
	) as Environment | null;
	const embeddedUpdateId = request.headers.get("expo-embedded-update-id");
	const currentUpdateId = request.headers.get("expo-current-update-id");

	if (
		!runtimeVersion ||
		!platform ||
		!protocolVersion ||
		!embeddedUpdateId ||
		!currentUpdateId ||
		!environment
	) {
		return new Response(
			JSON.stringify({
				error: "Not Enough Params",
			}),
			{
				status: 404,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	try {
		const currentBundle = await dbNodeClient.find({
			conditions: { bundleId: currentUpdateId },
		});
		let nextBundle: Bundle | null;

		const isEmbedded = !currentBundle;

		await dbNodeClient.init();

		const bundles = await dbNodeClient.findAll({
			conditions: {
				runtimeVersion,
				environment,
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
			throw new NoUpdateAvailableError();
		}

		if (nextBundle.bundleId === currentBundle?.bundleId) {
			throw new Error("latest Version");
		}

		const updateBundlePath = `${runtimeVersion}/${environment}/${nextBundle.bundleId}/`;

		try {
			const metadata = await storageNodeClient.getFile({
				key: `${updateBundlePath}metadata.json`,
			});

			const metadataJson = await parseFileAsJson<ExpoMetadata>(metadata);

			const expoConfig = await storageNodeClient.getFile({
				key: `${updateBundlePath}expoConfig.json`,
			});

			const expoConfigJson = await parseFileAsJson<ExpoConfig>(expoConfig);

			const platformMetadata = metadataJson.fileMetadata[platform];

			const assets = await Promise.all(
				platformMetadata.assets.map((asset) => {
					const generateAsset = async (): Promise<Asset> => {
						const file = await storageNodeClient.getFile({
							key: `${updateBundlePath}${asset.path}`.replace(/\\/g, "/"),
						});
						return {
							contentType: mime.getType(asset.ext)!,
							url: await storageNodeClient.getFileSignedUrl({
								key: `${updateBundlePath}${asset.path.replace(/\\/g, "/")}`,
							}),
							fileExtension: `.${asset.ext}`,
							key: await createHash(file, "md5", "hex"),
							hash: getBase64URLEncoding(
								await createHash(file, "sha256", "base64"),
							),
						};
					};
					return generateAsset();
				}),
			);

			const launchAssetFile = await storageNodeClient.getFile({
				key: `${updateBundlePath}${platformMetadata.bundle}`.replace(
					/\\/g,
					"/",
				),
			});

			const launchAsset: Asset = {
				contentType: "application/javascript",
				fileExtension: ".bundle",
				url: await storageNodeClient.getFileSignedUrl({
					key: `${updateBundlePath}${platformMetadata.bundle.replace(
						/\\/g,
						"/",
					)}`,
				}),
				key: await createHash(launchAssetFile, "md5", "hex"),
				hash: getBase64URLEncoding(
					await createHash(launchAssetFile, "sha256", "base64"),
				),
			};

			const manifest: Manifest = {
				id: nextBundle.bundleId,
				createdAt: new Date(Date.now()).toString(),
				runtimeVersion,
				metadata: {},
				assets,
				launchAsset,
				extra: {
					expoClient: expoConfigJson,
					// 현재 번들이 강제 업데이트를 필요로 하는 업데이트인지
					shouldForceUpdate: currentBundle?.updatePolicy === "FORCE_UPDATE",
				},
			};
			console.log(manifest);
			const assetRequestHeaders: { [key: string]: object } = {};
			for (const asset of [...manifest.assets, manifest.launchAsset]) {
				assetRequestHeaders[asset.key] = {
					"test-header": "test-header-value",
				};
			}

			const form = new FormData();
			form.append("manifest", JSON.stringify(manifest), {
				contentType: "application/json",
				header: {
					"content-type": "application/json; charset=utf-8",
				},
			});

			form.append("extensions", JSON.stringify({ assetRequestHeaders }), {
				contentType: "application/json",
			});

			const buffer = form.getBuffer();

			const headers = {
				"expo-protocol-version": protocolVersion.toString(),
				"expo-sfv-version": "0",
				"cache-control": "private, max-age=0",
				"content-type": `multipart/mixed; boundary=${form.getBoundary()}`,
				"expo-current-update-id": nextBundle.bundleId,
				...form.getHeaders(), // 중요: form 자체가 필요한 헤더들 추가
			};

			return new Response(buffer, {
				status: 200,
				headers,
			});
		} catch (maybeNoUpdateAvailableError) {
			if (maybeNoUpdateAvailableError instanceof NoUpdateAvailableError) {
				return await putNoUpdateAvailableInResponseAsync(
					request,
					protocolVersion,
				);
			}
			throw maybeNoUpdateAvailableError;
		}
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}
}

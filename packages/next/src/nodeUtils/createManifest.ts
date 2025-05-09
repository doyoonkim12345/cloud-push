import { createHash } from "@/nodeUtils/createHash";
import { getBase64URLEncoding } from "@/utils/getBase64URLEncoding";
import type {
	Asset,
	AssetMetadata,
	ExpoMetadata,
	Manifest,
	PlatformMetadata,
} from "@/types";
import type { StorageClient } from "@cloud-push/cloud";
import { parseFileAsJson, type Platform } from "@cloud-push/core";
import type { ExpoConfig } from "@expo/config-types";
import mime from "mime";

const normalizePath = (path: string) => path.replace(/\\/g, "/");

const createAssets = async ({
	platformMetadata,
	storageClient,
	bundlePath,
}: {
	platformMetadata: PlatformMetadata;
	storageClient: StorageClient;
	bundlePath: string;
}) => {
	const generateAsset = async (asset: AssetMetadata): Promise<Asset> => {
		const file = await storageClient.getFile({
			key: `${bundlePath}${normalizePath(asset.path)}`,
		});

		const key = await createHash(file, "md5", "hex");

		const hash = getBase64URLEncoding(
			await createHash(file, "sha256", "base64"),
		);

		const url = await storageClient.getFileSignedUrl({
			key: `${bundlePath}${normalizePath(asset.path)}`,
		});

		return {
			contentType: mime.getType(asset.ext)!,
			url,
			fileExtension: `.${asset.ext}`,
			key,
			hash,
		};
	};

	const assets = await Promise.all(platformMetadata.assets.map(generateAsset));

	return assets;
};

const createLaunchAsset = async ({
	bundlePath,
	storageClient,
	platformMetadataBundle,
}: {
	bundlePath: string;
	storageClient: StorageClient;
	platformMetadataBundle: string;
}) => {
	const launchAssetFile = await storageClient.getFile({
		key: `${bundlePath}${normalizePath(platformMetadataBundle)}`,
	});

	const launchAssetFileUrl = await storageClient.getFileSignedUrl({
		key: `${bundlePath}${normalizePath(platformMetadataBundle)}`,
	});

	const key = await createHash(launchAssetFile, "md5", "hex");

	const hash = getBase64URLEncoding(
		await createHash(launchAssetFile, "sha256", "base64"),
	);

	const launchAsset: Asset = {
		contentType: "application/javascript",
		fileExtension: ".bundle",
		url: launchAssetFileUrl,
		key,
		hash,
	};

	return launchAsset;
};

const getExpoConfig = async ({
	bundlePath,
	storageClient,
}: {
	bundlePath: string;
	storageClient: StorageClient;
}) => {
	const expoConfig = await storageClient.getFile({
		key: `${bundlePath}expoConfig.json`,
	});
	const expoConfigJson = parseFileAsJson<ExpoConfig>(expoConfig);
	return expoConfigJson;
};

const getMetadata = async ({
	storageClient,
	bundlePath,
}: {
	storageClient: StorageClient;
	bundlePath: string;
}) => {
	const metadata = await storageClient.getFile({
		key: `${bundlePath}metadata.json`,
	});
	const metadataJson = parseFileAsJson<ExpoMetadata>(metadata);
	return metadataJson;
};

export const createManifest = async ({
	bundleId,
	channel,
	runtimeVersion,
	platform,
	storageClient,
	extra,
}: {
	bundleId: string;
	channel: string;
	runtimeVersion: string;
	platform: Platform;
	storageClient: StorageClient;
	extra?: object;
}): Promise<Manifest> => {
	const updateBundlePath = `${runtimeVersion}/${channel}/${bundleId}/`;

	const metadata = await getMetadata({
		storageClient,
		bundlePath: updateBundlePath,
	});

	const assets = await createAssets({
		bundlePath: updateBundlePath,
		storageClient,
		platformMetadata: metadata.fileMetadata[platform],
	});

	const launchAsset = await createLaunchAsset({
		bundlePath: updateBundlePath,
		storageClient,
		platformMetadataBundle: metadata.fileMetadata[platform].bundle,
	});

	const expoConfig = await getExpoConfig({
		bundlePath: updateBundlePath,
		storageClient,
	});

	const manifest: Manifest = {
		id: bundleId,
		createdAt: new Date(Date.now()).toISOString(),
		runtimeVersion,
		metadata: {},
		assets,
		launchAsset,
		extra: {
			...extra,
			expoClient: expoConfig,
			// 현재 번들이 강제 업데이트를 필요로 하는 업데이트인지
			// shouldForceUpdate: currentBundle?.updatePolicy === "FORCE_UPDATE",
		},
	};

	return manifest;
};

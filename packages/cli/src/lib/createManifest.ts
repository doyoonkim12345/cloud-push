
import type { ExpoConfig } from "@expo/config-types";
import mime from "mime";
import { createHash } from "./createHash";
import type { Asset, AssetMetadata, ExpoMetadata, Manifest, PlatformMetadata } from "@/types";
import { getBase64URLEncoding } from "./getBase64URLEncoding";
import type { Platform, StorageClient } from "@cloud-push/cloud";
import path from "node:path";
import { readJsonFile } from "./readJsonFile";
import fs from "node:fs/promises";

const normalizePath = (path: string) => path.replace(/\\/g, "/");

const createAssets = async ({
	platformMetadata,
	bundlePath,
	cloudPath,
	storageClient,
}: {
	platformMetadata: PlatformMetadata;
	bundlePath: string;
	cloudPath: string;
	storageClient: StorageClient;
}) => {
	const generateAsset = async (asset: AssetMetadata): Promise<Asset> => {
		const buffer = await fs.readFile(path.join(bundlePath, asset.path))

		const key = await createHash(buffer, "md5", "hex");

		const hash = getBase64URLEncoding(
			await createHash(buffer, "sha256", "base64"),
		);

		const url = await storageClient.getFileSignedUrl({
			key: path.join(cloudPath, normalizePath(asset.path)),
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
	cloudPath,
	storageClient,
	platformMetadataBundle,
}: {
	bundlePath: string;
	cloudPath: string;
	storageClient: StorageClient;
	platformMetadataBundle: string;
}) => {
	const buffer = await fs.readFile(path.join(bundlePath, normalizePath(platformMetadataBundle)))

	const launchAssetFileUrl = await storageClient.getFileSignedUrl({
		key: path.join(cloudPath, normalizePath(platformMetadataBundle))
	});

	const key = await createHash(buffer, "md5", "hex");

	const hash = getBase64URLEncoding(
		await createHash(buffer, "sha256", "base64"),
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

export const createManifest = async ({
	updateId,
	runtimeVersion,
	platform,
	storageClient,
	extra,
	cloudPath,
	bundlePath,
}: {
	updateId: string;
	runtimeVersion: string;
	platform: Platform;
	storageClient: StorageClient;
	cloudPath: string;
	bundlePath: string;
	extra?: object;
}): Promise<Manifest> => {

	const metadata = await readJsonFile<ExpoMetadata>(path.join(bundlePath, "metadata.json"))


	const assets = await createAssets({
		bundlePath,
		cloudPath,
		platformMetadata: metadata.fileMetadata[platform],
		storageClient,
	});

	const launchAsset = await createLaunchAsset({
		bundlePath,
		platformMetadataBundle: metadata.fileMetadata[platform].bundle,
		cloudPath,
		storageClient,
	});

	const expoConfig = await readJsonFile<ExpoConfig>(path.join(bundlePath, "expoConfig.json"))

	const createdAt = new Date().toISOString();

	const manifest: Manifest = {
		id: updateId,
		createdAt,
		runtimeVersion,
		metadata: {},
		assets,
		launchAsset,
		extra: {
			...extra,
			expoClient: expoConfig,
		},
	};

	return manifest;
};

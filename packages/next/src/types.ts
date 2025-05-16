export type Asset = {
	hash?: string;
	key: string;
	contentType: string;
	fileExtension?: string;
	url: string;
};

export type Manifest = {
	id: string;
	createdAt: string;
	runtimeVersion: string;
	launchAsset: Asset;
	assets: Asset[];
	metadata: { [key: string]: string };
	extra: { [key: string]: any };
};

export type Directive = {
	type: "rollBackToEmbedded";
	parameters?: { [key: string]: any };
	extra?: { [key: string]: any };
};

export type ExpoAssetHeaderDictionary = {
	[assetKey: string]: {
		[headerName: string]: string;
	};
};

export type Extensions = {
	assetRequestHeaders: ExpoAssetHeaderDictionary;
};

export interface AssetMetadata {
	path: string;
	ext: string;
}

export interface PlatformMetadata {
	bundle: string;
	assets: AssetMetadata[];
}

interface FileMetadata {
	ios: PlatformMetadata;
	android: PlatformMetadata;
}

export interface ExpoMetadata {
	version: number;
	bundler: string;
	fileMetadata: FileMetadata;
}

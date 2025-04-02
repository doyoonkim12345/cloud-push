interface AssetMetadata {
  path: string;
  ext: string;
}

interface PlatformMetadata {
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

import path from "path";
import getBase64URLEncoding from "./getBase64URLEncoding";
import fs from "fs/promises";
import mime from "mime";
import createHash from "./createHash";

type GetAssetMetadataArg =
  | {
      updateBundlePath: string;
      filePath: string;
      ext: null;
      isLaunchAsset: true;
      runtimeVersion: string;
      platform: string;
    }
  | {
      updateBundlePath: string;
      filePath: string;
      ext: string;
      isLaunchAsset: false;
      runtimeVersion: string;
      platform: string;
    };

export default async function getAssetMetadataAsync(arg: GetAssetMetadataArg) {
  const assetFilePath = `${arg.updateBundlePath}/${arg.filePath}`;
  const asset = await fs.readFile(path.resolve(assetFilePath), null);
  const assetHash = getBase64URLEncoding(createHash(asset, "sha256", "base64"));
  const key = createHash(asset, "md5", "hex");
  const keyExtensionSuffix = arg.isLaunchAsset ? "bundle" : arg.ext;
  const contentType = arg.isLaunchAsset
    ? "application/javascript"
    : mime.getType(arg.ext);

  return {
    hash: assetHash,
    key,
    fileExtension: `.${keyExtensionSuffix}`,
    contentType,
    url: `${process.env.HOSTNAME}/api/assets?asset=${assetFilePath}&runtimeVersion=${arg.runtimeVersion}&platform=${arg.platform}`,
  };
}

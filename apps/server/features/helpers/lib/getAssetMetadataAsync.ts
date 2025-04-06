import path from "path";
import getBase64URLEncoding from "./getBase64URLEncoding";
import fs from "fs/promises";
import mime from "mime";
import createHash from "../../hash/lib/createHash";
import { getFile } from "@/features/api/client";

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
  const assetFile = await getFile({ bucketName: process.env.AWS_BUCKET_NAME!, 
    key : arg.updateBundlePath
   });
  const assetHash = getBase64URLEncoding(
    await createHash(assetFile, "sha256", "base64")
  );
  const key = await createHash(assetFile, "md5", "hex");
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

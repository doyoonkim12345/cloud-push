import { getFile } from "@/features/api/client";
import createHash from "../../hash/lib/createHash";
import { ExpoMetadata } from "@/features/s3/lib/types";
import { parseFileAsJson } from "@cloud-push/core/utils";

export default async function getMetadataAsync({
  updateBundlePath,
  runtimeVersion,
}: {
  updateBundlePath: string;
  runtimeVersion: string;
}) {
  try {
    const metadataPath = `${updateBundlePath}/metadata.json`;
    const metadataJsonFile = await getFile({
      key: metadataPath,
      mimeType: "application/json",
      bucketName: process.env.AWS_BUCKET_NAME!,
    });
    const metadataJson = await parseFileAsJson<ExpoMetadata>(metadataJsonFile);

    return {
      metadataJson,
      createdAt: new Date(metadataJsonFile.lastModified).toISOString(),
      id: createHash(metadataJsonFile, "sha256", "hex"),
    };
  } catch (error) {
    throw new Error(
      `No update found with runtime version: ${runtimeVersion}. Error: ${error}`
    );
  }
}

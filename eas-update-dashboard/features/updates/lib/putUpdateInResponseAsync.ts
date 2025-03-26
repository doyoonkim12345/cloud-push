import convertSHA256HashToUUID from "@/features/helpers/lib/convertSHA256HashToUUID";
import convertToDictionaryItemsRepresentation from "@/features/helpers/lib/convertToDictionaryItemsRepresentation";
import getAssetMetadataAsync from "@/features/helpers/lib/getAssetMetadataAsync";
import getExpoConfigAsync from "@/features/helpers/lib/getExpoConfigAsync";
import { NoUpdateAvailableError } from "@/features/helpers/lib/getLatestUpdateBundlePathForRuntimeVersionAsync";
import getMetadataAsync from "@/features/helpers/lib/getMetadataAsync";
import getPrivateKeyAsync from "@/features/helpers/lib/getPrivateKeyAsync";
import signRSASHA256 from "@/features/helpers/lib/signRSASHA256";
import { NextRequest } from "next/server";
import { serializeDictionary } from "structured-headers";
import FormData from "form-data";

export default async function putUpdateInResponseAsync(
  req: NextRequest,
  updateBundlePath: string,
  runtimeVersion: string,
  platform: string,
  protocolVersion: number
): Promise<Response> {
  const currentUpdateId = req.headers.get("expo-current-update-id");
  const { metadataJson, createdAt, id } = await getMetadataAsync({
    updateBundlePath,
    runtimeVersion,
  });

  // NoUpdateAvailable directive only supported on protocol version 1
  // for protocol version 0, serve most recent update as normal
  if (
    currentUpdateId === convertSHA256HashToUUID(id) &&
    protocolVersion === 1
  ) {
    throw new NoUpdateAvailableError();
  }

  const expoConfig = await getExpoConfigAsync({
    updateBundlePath,
    runtimeVersion,
  });
  const platformSpecificMetadata = metadataJson.fileMetadata[platform];
  const manifest = {
    id: convertSHA256HashToUUID(id),
    createdAt,
    runtimeVersion,
    assets: await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (platformSpecificMetadata.assets as any[]).map((asset) =>
        getAssetMetadataAsync({
          updateBundlePath,
          filePath: asset.path,
          ext: asset.ext,
          runtimeVersion,
          platform,
          isLaunchAsset: false,
        })
      )
    ),
    launchAsset: await getAssetMetadataAsync({
      updateBundlePath,
      filePath: platformSpecificMetadata.bundle,
      isLaunchAsset: true,
      runtimeVersion,
      platform,
      ext: null,
    }),
    metadata: {},
    extra: {
      expoClient: expoConfig,
    },
  };

  let signature = null;
  const expectSignatureHeader = req.headers.get("expo-expect-signature");
  if (expectSignatureHeader) {
    const privateKey = await getPrivateKeyAsync();
    if (!privateKey) {
      return new Response(
        JSON.stringify({
          error:
            "Code signing requested but no key supplied when starting server.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const manifestString = JSON.stringify(manifest);
    const hashSignature = signRSASHA256(manifestString, privateKey);
    const dictionary = convertToDictionaryItemsRepresentation({
      sig: hashSignature,
      keyid: "main",
    });
    signature = serializeDictionary(dictionary);
  }

  const assetRequestHeaders: { [key: string]: object } = {};
  [...manifest.assets, manifest.launchAsset].forEach((asset) => {
    assetRequestHeaders[asset.key] = {
      "test-header": "test-header-value",
    };
  });

  const form = new FormData();
  form.append("manifest", JSON.stringify(manifest), {
    contentType: "application/json",
    header: {
      "content-type": "application/json; charset=utf-8",
      ...(signature ? { "expo-signature": signature } : {}),
    },
  });
  form.append("extensions", JSON.stringify({ assetRequestHeaders }), {
    contentType: "application/json",
  });

  const buffer = form.getBuffer();

  const headers = new Headers();
  headers.set("expo-protocol-version", protocolVersion.toString());
  headers.set("expo-sfv-version", "0");
  headers.set("cache-control", "private, max-age=0");
  headers.set(
    "content-type",
    `multipart/mixed; boundary=${form.getBoundary()}`
  );

  return new Response(buffer, {
    status: 200,
    headers,
  });
}

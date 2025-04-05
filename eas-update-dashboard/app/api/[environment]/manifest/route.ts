import { getFile, getFileSignedUrl } from "@/features/api/client";
import createHash from "@/features/hash/lib/createHash";
import getBase64URLEncoding from "@/features/helpers/lib/getBase64URLEncoding";
import { NoUpdateAvailableError } from "@/features/helpers/lib/getLatestUpdateBundlePathForRuntimeVersionAsync";
import { ExpoMetadata } from "@/features/s3/lib/types";
import putNoUpdateAvailableInResponseAsync from "@/features/updates/lib/putNoUpdateAvailableInResponseAsync";
import putRollBackInResponseAsync from "@/features/updates/lib/putRollBackInResponseAsync";
import { UpdateType } from "@/features/updates/types";
import { NextRequest } from "next/server";
import mime from "mime";
import FormData from "form-data";
import { Environment } from "eas-update-core";
import { VersionCursorStore } from "eas-update-core/version-cursor";
import { parseFileAsJson } from "eas-update-core/utils";

type Manifest = {
  id: string;
  createdAt: string;
  runtimeVersion: string;
  launchAsset: Asset;
  assets: Asset[];
  metadata: { [key: string]: string };
  extra: { [key: string]: any };
};

type Asset = {
  hash?: string;
  key: string;
  contentType: string;
  fileExtension?: string;
  url: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ environment: Environment }> }
) {
  const { environment } = await params;

  const protocolVersionHeader = request.headers.get("expo-protocol-version");
  const protocolVersion = parseInt(protocolVersionHeader ?? "0", 10);

  if (protocolVersion !== 1) {
    return new Response(
      JSON.stringify({
        error: "Unsupported expo-protocol-version. Expected 1.",
      }),
      {
        status: 406,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // platform을 헤더 또는 쿼리 파라미터에서 가져옴
  const platformFromHeader = request.headers.get("expo-platform");
  const searchParams = request.nextUrl.searchParams;

  const platformFromQuery = searchParams.get("platform");
  const platform = platformFromHeader ?? platformFromQuery;

  if (platform !== "ios" && platform !== "android") {
    return new Response(
      JSON.stringify({
        error: "Unsupported platform. Expected either ios or android.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const runtimeVersionFromHeader = request.headers.get("expo-runtime-version");
  const runtimeVersionFromQuery = searchParams.get("runtime-version");
  const runtimeVersion = runtimeVersionFromHeader ?? runtimeVersionFromQuery;

  if (!runtimeVersion) {
    return new Response(
      JSON.stringify({
        error: "No runtimeVersion provided.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let updateBundlePath: string;
  let bundleId: string;
  try {
    const cursorFile = await getFile({
      bucketName: process.env.AWS_BUCKET_NAME!,
      key: "cursor.json",
    });

    const versionCursorStore = new VersionCursorStore();

    await versionCursorStore.loadFromJSON(cursorFile);

    const [targetBundleId] = versionCursorStore
      .find({
        environment,
        platforms: [platform],
        runtimeVersion,
      })
      .sort({ field: "createdAt", order: "desc" })[0];

    bundleId = targetBundleId;

    updateBundlePath = `${runtimeVersion}/${environment}/${bundleId}/`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // const updateType = await getTypeOfUpdateAsync(updateBundlePath);
  const updateType = UpdateType.NORMAL_UPDATE;

  try {
    try {
      if (updateType === UpdateType.NORMAL_UPDATE) {
        const currentUpdateId = request.headers.get("expo-current-update-id");

        // if (currentUpdateId === bundleId) {
        //   return new Response(JSON.stringify({ error: { bundleId } }), {
        //     status: 404,
        //     headers: { "Content-Type": "application/json" },
        //   });
        // }

        const metadata = await getFile({
          bucketName: process.env.AWS_BUCKET_NAME!,
          mimeType: "application/json",
          key: `${updateBundlePath}metadata.json`,
        });

        const metadataJson = await parseFileAsJson<ExpoMetadata>(metadata);

        const expoConfig = await getFile({
          bucketName: process.env.AWS_BUCKET_NAME!,
          mimeType: "application/json",
          key: `${updateBundlePath}expoConfig.json`,
        });

        const expoConfigJson = await parseFileAsJson<any>(expoConfig);

        console.log("expoConfigJson", expoConfigJson);

        const createdAt = new Date(metadata.lastModified).toISOString();
        const platformMetadata = metadataJson.fileMetadata[platform];

        const assets = await Promise.all(
          platformMetadata.assets.map((asset) => {
            const generateAsset = async (): Promise<Asset> => {
              const file = await getFile({
                bucketName: process.env.AWS_BUCKET_NAME!,
                key: `${updateBundlePath}${asset.path}`.replace(/\\/g, "/"),
              });
              return {
                contentType: mime.getType(asset.ext)!,
                url: await getFileSignedUrl({
                  bucketName: process.env.AWS_BUCKET_NAME!,
                  key: `${updateBundlePath}${asset.path.replace(/\\/g, "/")}`,
                }),
                fileExtension: `.${asset.ext}`,
                key: await createHash(file, "md5", "hex"),
                hash: getBase64URLEncoding(
                  await createHash(file, "sha256", "base64")
                ),
              };
            };
            return generateAsset();
          })
        );

        const launchAssetFile = await getFile({
          bucketName: process.env.AWS_BUCKET_NAME!,
          key: `${updateBundlePath}${platformMetadata.bundle}`.replace(
            /\\/g,
            "/"
          ),
        });

        const launchAsset: Asset = {
          contentType: "application/javascript",
          fileExtension: ".bundle",
          url: await getFileSignedUrl({
            bucketName: process.env.AWS_BUCKET_NAME!,
            key: `${updateBundlePath}${platformMetadata.bundle.replace(
              /\\/g,
              "/"
            )}`,
          }),
          key: await createHash(launchAssetFile, "md5", "hex"),
          hash: getBase64URLEncoding(
            await createHash(launchAssetFile, "sha256", "base64")
          ),
        };

        console.log("bundleId", bundleId);

        const manifest: Manifest = {
          id: bundleId,
          createdAt,
          runtimeVersion,
          metadata: {},
          assets,
          launchAsset,
          extra: {
            expoClient: expoConfigJson,
          },
        };

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
        // headers.set("expo-current-update-id", bundleId);

        return new Response(buffer, {
          status: 200,
          headers,
        });
      } else if (updateType === UpdateType.ROLLBACK) {
        return await putRollBackInResponseAsync(
          request,
          updateBundlePath,
          protocolVersion
        );
      }
    } catch (maybeNoUpdateAvailableError) {
      if (maybeNoUpdateAvailableError instanceof NoUpdateAvailableError) {
        return await putNoUpdateAvailableInResponseAsync(
          request,
          protocolVersion
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

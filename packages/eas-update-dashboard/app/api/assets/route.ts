import fs from "fs";
import fsPromises from "fs/promises";
import mime from "mime";
import nullthrows from "nullthrows";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import getLatestUpdateBundlePathForRuntimeVersionAsync from "@/features/helpers/lib/getLatestUpdateBundlePathForRuntimeVersionAsync";
import getMetadataAsync from "@/features/helpers/lib/getMetadataAsync";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assetName = searchParams.get("asset");
  const runtimeVersion = searchParams.get("runtimeVersion");
  const platform = searchParams.get("platform");

  if (!assetName) {
    return NextResponse.json(
      { error: "No asset name provided." },
      { status: 400 }
    );
  }

  if (platform !== "ios" && platform !== "android") {
    return NextResponse.json(
      { error: 'No platform provided. Expected "ios" or "android".' },
      { status: 400 }
    );
  }

  if (!runtimeVersion) {
    return NextResponse.json(
      { error: "No runtimeVersion provided." },
      { status: 400 }
    );
  }

  let updateBundlePath: string;
  try {
    updateBundlePath = await getLatestUpdateBundlePathForRuntimeVersionAsync(
      runtimeVersion
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const { metadataJson } = await getMetadataAsync({
    updateBundlePath,
    runtimeVersion,
  });

  const assetPath = path.resolve(assetName);
  const assetMetadata = metadataJson.fileMetadata[platform].assets.find(
    (asset: any) => asset.path === assetName.replace(`${updateBundlePath}/`, "")
  );
  const isLaunchAsset =
    metadataJson.fileMetadata[platform].bundle ===
    assetName.replace(`${updateBundlePath}/`, "");

  if (!fs.existsSync(assetPath)) {
    return NextResponse.json(
      { error: `Asset "${assetName}" does not exist.` },
      { status: 404 }
    );
  }

  try {
    const asset = await fsPromises.readFile(assetPath, null);

    const contentType = isLaunchAsset
      ? "application/javascript"
      : nullthrows(mime.getType(assetMetadata.ext));

    // Next.js App Router에서는 Response 객체를 반환합니다
    return new Response(asset, {
      status: 200,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

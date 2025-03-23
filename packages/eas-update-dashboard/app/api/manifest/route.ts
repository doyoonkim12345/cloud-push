import convertSHA256HashToUUID from "@/features/helpers/lib/convertSHA256HashToUUID";
import convertToDictionaryItemsRepresentation from "@/features/helpers/lib/convertToDictionaryItemsRepresentation";
import createNoUpdateAvailableDirectiveAsync from "@/features/helpers/lib/createNoUpdateAvailableDirectiveAsync";
import createRollBackDirectiveAsync from "@/features/helpers/lib/createRollBackDirectiveAsync";
import getAssetMetadataAsync from "@/features/helpers/lib/getAssetMetadataAsync";
import getExpoConfigAsync from "@/features/helpers/lib/getExpoConfigAsync";
import getLatestUpdateBundlePathForRuntimeVersionAsync, {
  NoUpdateAvailableError,
} from "@/features/helpers/lib/getLatestUpdateBundlePathForRuntimeVersionAsync";
import getMetadataAsync from "@/features/helpers/lib/getMetadataAsync";
import getPrivateKeyAsync from "@/features/helpers/lib/getPrivateKeyAsync";
import signRSASHA256 from "@/features/helpers/lib/signRSASHA256";
import FormData from "form-data";
import fs from "fs/promises";
import { NextRequest } from "next/server";
import { serializeDictionary } from "structured-headers";

export async function GET(request: NextRequest) {
  const protocolVersionHeader = request.headers.get("expo-protocol-version");
  const protocolVersion = parseInt(protocolVersionHeader ?? "0", 10);

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
  try {
    updateBundlePath = await getLatestUpdateBundlePathForRuntimeVersionAsync(
      runtimeVersion
    );
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

  const updateType = await getTypeOfUpdateAsync(updateBundlePath);

  try {
    try {
      if (updateType === UpdateType.NORMAL_UPDATE) {
        return await putUpdateInResponseAsync(
          request,
          updateBundlePath,
          runtimeVersion,
          platform,
          protocolVersion
        );
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

enum UpdateType {
  NORMAL_UPDATE,
  ROLLBACK,
}

async function getTypeOfUpdateAsync(
  updateBundlePath: string
): Promise<UpdateType> {
  const directoryContents = await fs.readdir(updateBundlePath);
  return directoryContents.includes("rollback")
    ? UpdateType.ROLLBACK
    : UpdateType.NORMAL_UPDATE;
}

async function putUpdateInResponseAsync(
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
      (platformSpecificMetadata.assets as any[]).map((asset: any) =>
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

async function putRollBackInResponseAsync(
  req: NextRequest,
  updateBundlePath: string,
  protocolVersion: number
): Promise<Response> {
  if (protocolVersion === 0) {
    throw new Error("Rollbacks not supported on protocol version 0");
  }

  const embeddedUpdateId = req.headers.get("expo-embedded-update-id");
  if (!embeddedUpdateId) {
    throw new Error(
      "Invalid Expo-Embedded-Update-ID request header specified."
    );
  }

  const currentUpdateId = req.headers.get("expo-current-update-id");
  if (currentUpdateId === embeddedUpdateId) {
    throw new NoUpdateAvailableError();
  }

  const directive = await createRollBackDirectiveAsync(updateBundlePath);

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
    const directiveString = JSON.stringify(directive);
    const hashSignature = signRSASHA256(directiveString, privateKey);
    const dictionary = convertToDictionaryItemsRepresentation({
      sig: hashSignature,
      keyid: "main",
    });
    signature = serializeDictionary(dictionary);
  }

  const form = new FormData();
  form.append("directive", JSON.stringify(directive), {
    contentType: "application/json",
    header: {
      "content-type": "application/json; charset=utf-8",
      ...(signature ? { "expo-signature": signature } : {}),
    },
  });

  const buffer = form.getBuffer();

  const headers = new Headers();
  headers.set("expo-protocol-version", "1");
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

async function putNoUpdateAvailableInResponseAsync(
  req: NextRequest,
  protocolVersion: number
): Promise<Response> {
  if (protocolVersion === 0) {
    throw new Error(
      "NoUpdateAvailable directive not available in protocol version 0"
    );
  }

  const directive = await createNoUpdateAvailableDirectiveAsync();

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
    const directiveString = JSON.stringify(directive);
    const hashSignature = signRSASHA256(directiveString, privateKey);
    const dictionary = convertToDictionaryItemsRepresentation({
      sig: hashSignature,
      keyid: "main",
    });
    signature = serializeDictionary(dictionary);
  }

  const form = new FormData();
  form.append("directive", JSON.stringify(directive), {
    contentType: "application/json",
    header: {
      "content-type": "application/json; charset=utf-8",
      ...(signature ? { "expo-signature": signature } : {}),
    },
  });

  const buffer = form.getBuffer();

  const headers = new Headers();
  headers.set("expo-protocol-version", "1");
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

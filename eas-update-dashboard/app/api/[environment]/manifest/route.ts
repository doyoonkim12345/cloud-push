import getLatestUpdateBundlePathForRuntimeVersionAsync, {
  NoUpdateAvailableError,
} from "@/features/helpers/lib/getLatestUpdateBundlePathForRuntimeVersionAsync";
import { getS3LastestBundle } from "@/features/s3/lib/update";
import getTypeOfUpdateAsync from "@/features/updates/lib/getTypeOfUpdateAsync";
import putNoUpdateAvailableInResponseAsync from "@/features/updates/lib/putNoUpdateAvailableInResponseAsync";
import putRollBackInResponseAsync from "@/features/updates/lib/putRollBackInResponseAsync";
import putUpdateInResponseAsync from "@/features/updates/lib/putUpdateInResponseAsync";
import { Environment, UpdateType } from "@/features/updates/types";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ environment: Environment }> }
) {
  const { environment } = await params;

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
    updateBundlePath = await getS3LastestBundle({
      runtimeVersion,
      environment,
    });
    console.log(updateBundlePath);
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

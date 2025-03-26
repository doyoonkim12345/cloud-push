import convertToDictionaryItemsRepresentation from "@/features/helpers/lib/convertToDictionaryItemsRepresentation";
import createRollBackDirectiveAsync from "@/features/helpers/lib/createRollBackDirectiveAsync";
import { NoUpdateAvailableError } from "@/features/helpers/lib/getLatestUpdateBundlePathForRuntimeVersionAsync";
import getPrivateKeyAsync from "@/features/helpers/lib/getPrivateKeyAsync";
import signRSASHA256 from "@/features/helpers/lib/signRSASHA256";
import { NextRequest } from "next/server";
import { serializeDictionary } from "structured-headers";
import FormData from "form-data";

export default async function putRollBackInResponseAsync(
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

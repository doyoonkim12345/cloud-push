import { parseDictionary } from "structured-headers";
import { convertDictionaryToObject } from "./convertDictionaryToObject.js";

;// CONCATENATED MODULE: external "structured-headers"

;// CONCATENATED MODULE: external "./convertDictionaryToObject.js"

;// CONCATENATED MODULE: ./src/server/utils/parseHeaders.ts


const parseHeaders = ({ headers, url })=>{
    const runtimeVersionFromHeader = headers.get("expo-runtime-version");
    const runtimeVersionFromQuery = url.searchParams.get("runtime-version");
    const runtimeVersion = runtimeVersionFromHeader ?? runtimeVersionFromQuery;
    const platformFromHeader = headers.get("expo-platform");
    const platformFromQuery = url.searchParams.get("platform");
    const platform = platformFromHeader ?? platformFromQuery;
    const protocolVersionHeader = headers.get("expo-protocol-version");
    const protocolVersion = parseInt(protocolVersionHeader ?? "0", 10);
    const channel = headers.get("expo-channel-name");
    const embeddedUpdateId = headers.get("expo-embedded-update-id");
    const currentUpdateId = headers.get("expo-current-update-id");
    const expectSignature = headers.get("expo-expect-signature");
    const expectSignatureParsed = expectSignature ? parseDictionary(expectSignature) : null;
    return {
        runtimeVersion,
        platform,
        protocolVersion,
        currentUpdateId,
        channel,
        embeddedUpdateId,
        expectSignature: expectSignatureParsed ? convertDictionaryToObject(expectSignatureParsed) : null
    };
};

export { parseHeaders };

import type { Platform } from "@cloud-push/core";

export const parseHeaders = ({
	headers,
	url,
}: { headers: Headers; url: URL }) => {
	const runtimeVersionFromHeader = headers.get("expo-runtime-version");
	const runtimeVersionFromQuery = url.searchParams.get("runtime-version");
	const runtimeVersion = runtimeVersionFromHeader ?? runtimeVersionFromQuery;

	const platformFromHeader = headers.get("expo-platform");
	const platformFromQuery = url.searchParams.get("platform");
	const platform = (platformFromHeader ?? platformFromQuery) as Platform | null;

	const protocolVersionHeader = headers.get("expo-protocol-version");
	const protocolVersion = parseInt(protocolVersionHeader ?? "0", 10);

	const channel = headers.get("expo-channel-name") as string | null;
	const embeddedUpdateId = headers.get("expo-embedded-update-id");
	const currentUpdateId = headers.get("expo-current-update-id");

	return {
		runtimeVersion,
		platform,
		protocolVersion,
		currentUpdateId,
		channel,
		embeddedUpdateId,
	};
};

import type { Directive, Extensions, Manifest } from "@/types";
import { convertObjectToDictionary } from "@cloud-push/utils";
import FormData from "form-data";
import { serializeDictionary } from "structured-headers";

export function UpdateResponse({
	bundleId,
	manifest,
	directive,
	extensions,
	signature,
}: {
	bundleId: string;
	manifest?: Manifest;
	directive?: Directive;
	extensions?: Extensions;
	signature?: { sig: string; keyid: string };
}): Response {
	const form = new FormData();

	if (manifest) {
		form.append("manifest", JSON.stringify(manifest ?? {}), {
			contentType: "application/json",
			header: {
				"expo-signature": signature
					? serializeDictionary(convertObjectToDictionary(signature))
					: "",
			},
		});
	}

	if (directive) {
		form.append("directive", JSON.stringify(directive ?? {}), {
			contentType: "application/json",
		});
	}

	if (extensions) {
		form.append("extensions", JSON.stringify(extensions ?? {}), {
			contentType: "application/json",
		});
	}

	const headers = {
		"expo-protocol-version": "1",
		"expo-sfv-version": "0",
		"cache-control": "private, max-age=0",
		"content-type": `multipart/mixed; boundary=${form.getBoundary()}`,
		"expo-current-update-id": bundleId,

		...form.getHeaders(), // 중요: form 자체가 필요한 헤더들 추가
	};

	const buffer = form.getBuffer();

	return new Response(buffer, {
		status: 200,
		headers,
	});
}

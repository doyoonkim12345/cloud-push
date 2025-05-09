import type { Directive, Extensions, Manifest } from "@/types";
import FormData from "form-data";

export function UpdateResponse({
	bundleId,
	manifest,
	directive,
	extensions,
}: {
	bundleId: string;
	manifest?: Manifest;
	directive?: Directive;
	extensions?: Extensions;
}): Response {
	const form = new FormData();

	if (manifest) {
		form.append("manifest", JSON.stringify(manifest), {
			contentType: "application/json",
			header: {
				"content-type": "application/json; charset=utf-8",
			},
		});
	}

	if (directive) {
		form.append("directive", JSON.stringify(directive), {
			contentType: "application/json",
			header: {
				"content-type": "application/json; charset=utf-8",
			},
		});
	}

	if (extensions) {
		form.append("extensions", JSON.stringify(extensions), {
			contentType: "application/json",
			header: {
				"content-type": "application/json; charset=utf-8",
			},
		});
	}

	const headers = {
		"expo-protocol-version": "0",
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

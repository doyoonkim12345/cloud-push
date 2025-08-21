export function getBase64URLEncoding(base64EncodedString: string): string {
	return base64EncodedString
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

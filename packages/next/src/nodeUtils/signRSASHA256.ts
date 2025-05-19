import crypto from "node:crypto";

export function signRSASHA256(data: string, privateKey: string) {
	const sign = crypto.createSign("RSA-SHA256");
	sign.update(data, "utf8");
	sign.end();
	return sign.sign(privateKey, "base64");
}

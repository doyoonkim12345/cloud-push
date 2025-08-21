import crypto from "node:crypto";

export type CryptoAlgorithm =
	| "rsa-v1_5-sha256"
	| "rsa-v1_5-sha512"
	| "rsa-pss-sha256"
	| "ecdsa-p256-sha256"
	| "ed25519";

const cryptoAlgorithm: Record<CryptoAlgorithm, string> = {
	"rsa-v1_5-sha256": "RSA-SHA256",
	"rsa-v1_5-sha512": "RSA-SHA512",
	"rsa-pss-sha256": "RSA-PSS-SHA256",
	"ecdsa-p256-sha256": "ECDSA-SHA256",
	ed25519: "ED25519",
};

export function createSignature(
	alg: CryptoAlgorithm,
	data: string,
	privateKey: string,
) {
	const sign = crypto.createSign(cryptoAlgorithm[alg]);
	sign.update(data, "utf8");
	sign.end();
	return sign.sign(privateKey.replace(/\\n/g, "\n"), "base64");
}

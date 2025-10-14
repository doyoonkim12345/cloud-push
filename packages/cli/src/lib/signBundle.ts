import fs from "node:fs";
import crypto from "node:crypto";

/**
 * RSA-SHA256 방식으로 파일에 서명
 * @param filePath 서명할 파일 경로
 * @param privateKeyPath 개인 키 (PEM)
 * @returns 서명 base64 문자열
 */
export function signFile(filePath: string, privateKeyPath: string): string {
	const data = fs.readFileSync(filePath);
	const privateKey = fs.readFileSync(privateKeyPath, "utf8");

	const signer = crypto.createSign("RSA-SHA256");
	signer.update(data);
	signer.end();

	const signature = signer.sign(privateKey); // Buffer
	return signature.toString("base64");
}

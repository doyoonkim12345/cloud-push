import crypto, { type BinaryToTextEncoding } from "node:crypto";

export async function createHash(
	buffer: Uint8Array,
	hashingAlgorithm: string,
	encoding: BinaryToTextEncoding,
) {
	return crypto.createHash(hashingAlgorithm).update(buffer).digest(encoding);
}

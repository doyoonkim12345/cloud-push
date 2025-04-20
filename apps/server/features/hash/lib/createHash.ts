import crypto, { BinaryToTextEncoding } from "crypto";

export async function createHash(
  buffer: Buffer,
  hashingAlgorithm: string,
  encoding: BinaryToTextEncoding
) {
  return crypto.createHash(hashingAlgorithm).update(buffer).digest(encoding);
}

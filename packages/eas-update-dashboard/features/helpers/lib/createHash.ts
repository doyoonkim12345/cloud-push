import crypto, { BinaryToTextEncoding } from "crypto";

export default function createHash(
  file: Buffer,
  hashingAlgorithm: string,
  encoding: BinaryToTextEncoding
) {
  return crypto.createHash(hashingAlgorithm).update(file).digest(encoding);
}

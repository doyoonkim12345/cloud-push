import crypto, { BinaryToTextEncoding } from "crypto";

export default async function createHash(
  file: File,
  hashingAlgorithm: string,
  encoding: BinaryToTextEncoding
) {
  // File 객체를 ArrayBuffer로 변환 후 Buffer로 변환
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return crypto.createHash(hashingAlgorithm).update(buffer).digest(encoding);
}

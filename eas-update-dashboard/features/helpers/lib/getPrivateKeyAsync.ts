import fs from "fs/promises";
import path from "path";

export default async function getPrivateKeyAsync() {
  const privateKeyPath = process.env.PRIVATE_KEY_PATH;
  if (!privateKeyPath) {
    return null;
  }

  const pemBuffer = await fs.readFile(path.resolve(privateKeyPath));
  return pemBuffer.toString("utf8");
}

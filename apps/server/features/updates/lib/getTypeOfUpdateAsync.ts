import { UpdateType } from "../types";
import fs from "fs/promises";

export default async function getTypeOfUpdateAsync(
  updateBundlePath: string
): Promise<UpdateType> {
  const directoryContents = await fs.readdir(updateBundlePath);
  return directoryContents.includes("rollback")
    ? UpdateType.ROLLBACK
    : UpdateType.NORMAL_UPDATE;
}

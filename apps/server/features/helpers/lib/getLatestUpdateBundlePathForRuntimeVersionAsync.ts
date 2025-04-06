import { Environment } from "@/features/updates/types";
import truthy from "./truthy";
import fsSync from "fs";
import fs from "fs/promises";
import path from "path";

export class NoUpdateAvailableError extends Error {}

export default async function getLatestUpdateBundlePathForRuntimeVersionAsync(
  runtimeVersion: string,
  environment: Environment
) {
  const updatesDirectoryForRuntimeVersion = `updates/${runtimeVersion}`;
  if (!fsSync.existsSync(updatesDirectoryForRuntimeVersion)) {
    throw new Error("Unsupported runtime version");
  }

  const filesInUpdatesDirectory = await fs.readdir(
    updatesDirectoryForRuntimeVersion
  );
  const directoriesInUpdatesDirectory = (
    await Promise.all(
      filesInUpdatesDirectory.map(async (file) => {
        const fileStat = await fs.stat(
          path.join(updatesDirectoryForRuntimeVersion, file)
        );
        return fileStat.isDirectory() ? file : null;
      })
    )
  )
    .filter(truthy)
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  return path.join(
    updatesDirectoryForRuntimeVersion,
    directoriesInUpdatesDirectory[0]
  );
}

import fs from "fs/promises";
import path from "path";

/**
 * This adds the `@expo/config`-exported config to `extra.expoConfig`, which is a common thing
 * done by implementors of the expo-updates specification since a lot of Expo modules use it.
 * It is not required by the specification, but is included here in the example client and server
 * for demonstration purposes. EAS Update does something conceptually very similar.
 */
export default async function getExpoConfigAsync({
  updateBundlePath,
  runtimeVersion,
}: {
  updateBundlePath: string;
  runtimeVersion: string;
}): Promise<any> {
  try {
    const expoConfigPath = `${updateBundlePath}/expoConfig.json`;
    const expoConfigBuffer = await fs.readFile(
      path.resolve(expoConfigPath),
      null
    );
    const expoConfigJson = JSON.parse(expoConfigBuffer.toString("utf-8"));
    return expoConfigJson;
  } catch (error) {
    throw new Error(
      `No expo config json found with runtime version: ${runtimeVersion}. Error: ${error}`
    );
  }
}

import fs from "fs/promises";

export default async function createRollBackDirectiveAsync(
  updateBundlePath: string
) {
  try {
    const rollbackFilePath = `${updateBundlePath}/rollback`;
    const rollbackFileStat = await fs.stat(rollbackFilePath);
    return {
      type: "rollBackToEmbedded",
      parameters: {
        commitTime: new Date(rollbackFileStat.birthtime).toISOString(),
      },
    };
  } catch (error) {
    throw new Error(`No rollback found. Error: ${error}`);
  }
}

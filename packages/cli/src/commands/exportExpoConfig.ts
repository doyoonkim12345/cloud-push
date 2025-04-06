import { ENV_KEY } from "@/features/env/types";
import * as prompts from "@clack/prompts";
import { execa } from "execa";
import fs from "fs/promises";
import * as path from "path";

export async function exportExpoConfig({
  expoConfigPath,
  env,
}: {
  expoConfigPath: string;
  env: Partial<{ [K in ENV_KEY]: string }>;
}) {
  const spinner = prompts.spinner();
  spinner.start(`Starting Exporting ExpoConfig...`);

  try {
    const { stdout } = await execa(
      "expo",
      ["config", "--type", "public", "--json"],
      {
        env,
      }
    );

    await fs.writeFile(path.join(expoConfigPath, "expoConfig.json"), stdout);

    spinner.stop(`✅ Exporting ExpoConfig completed successfully!`);
  } catch (e) {
    spinner.stop(`❌ Exporting ExpoConfig failed: ${(e as Error).message}`);
    throw e;
  }
}

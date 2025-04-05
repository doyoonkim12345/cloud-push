import { parseEnv } from "@/lib/parseEnv";
import * as prompts from "@clack/prompts";
import { type Environment } from "eas-update-core";
import { execa } from "execa";
import fs from "fs/promises";
import * as path from "path";

export async function exportExpoConfig({
  expoConfigPath,
  environment,
}: {
  expoConfigPath: string;
  environment: Environment;
}) {
  const spinner = prompts.spinner();
  spinner.start(`Starting Exporting ExpoConfig...`);

  try {
    const { stdout } = await execa("eas", [
      `env:exec`,
      environment,
      `expo config --type public --json`,
    ]);

    await fs.writeFile(
      path.join(expoConfigPath, "expoConfig.json"),
      JSON.stringify(parseEnv(stdout))
    );

    spinner.stop(`✅ Exporting ExpoConfig completed successfully!`);
  } catch (e) {
    spinner.stop(`❌ Exporting ExpoConfig failed: ${(e as Error).message}`);
    throw e;
  }
}

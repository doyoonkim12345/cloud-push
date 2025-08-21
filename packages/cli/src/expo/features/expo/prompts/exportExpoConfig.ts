import * as prompts from "@clack/prompts";
import { execa } from "execa";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export async function exportExpoConfig({
	expoConfigPath,
}: {
	expoConfigPath: string;
}) {
	const spinner = prompts.spinner();
	spinner.start("Starting Exporting ExpoConfig...");

	try {
		const { stdout } = await execa(
			"expo",
			["config", "--type", "public", "--json"],
			{
				env: process.env,
			},
		);

		await fs.writeFile(path.join(expoConfigPath, "expoConfig.json"), stdout);

		spinner.stop("✅ Exporting ExpoConfig completed successfully!");
	} catch (e) {
		spinner.stop(`❌ Exporting ExpoConfig failed: ${(e as Error).message}`);
		throw e;
	}
}

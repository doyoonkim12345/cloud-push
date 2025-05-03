import { execa } from "execa";
import * as prompts from "@clack/prompts";
import type { Environment, Platform } from "@cloud-push/core";

// Define interfaces for function props
interface ExportBundlesProps {
	platforms: Platform[];
	bundlePath: string;
	environment: Environment;
}

// Function to export bundles
export async function exportBundles({
	platforms,
	bundlePath,
	environment,
}: ExportBundlesProps): Promise<void> {
	const title = `Exporting ${platforms.join(", ").toLocaleLowerCase()} bundles`;
	const spinner = prompts.spinner();
	spinner.start(`Starting ${title}...`);

	try {
		const { stdout } = await execa(
			"expo",
			[
				"export",
				...platforms.flatMap((platform) => [
					"--platform",
					platform.toLocaleLowerCase(),
				]),
				...["--output-dir", bundlePath],
				"--clear",
			],
			{ env: { ...process.env, NODE_ENV: environment } },
		);

		console.log(stdout);

		spinner.stop(`✅ ${title} completed successfully!`);
	} catch (error) {
		spinner.stop(`❌ ${title} failed: ${(error as Error).message}`);
		throw error; // Rethrow the error to stop further execution
	}
}

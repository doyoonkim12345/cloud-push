import checkPackageAvailable from "@/lib/checkPackageAvailable";
import { execa } from "execa";
import * as prompts from "@clack/prompts";
import type { Platform } from "@cloud-push/core";

// Define interfaces for function props
interface ExportBundlesProps {
	platforms: Platform[];
	bundlePath: string;
}

// Function to export bundles
export async function exportBundles({
	platforms,
	bundlePath,
}: ExportBundlesProps): Promise<void> {
	const title = `Exporting ${platforms.join(", ").toLocaleLowerCase()} bundles`;
	const spinner = prompts.spinner();
	spinner.start(`Starting ${title}...`);

	try {
		await execa("expo", [
			"export",
			...platforms.flatMap((platform) => [
				"--platform",
				platform.toLocaleLowerCase(),
			]),
			...["--output-dir", bundlePath],
		]);
		spinner.stop(`✅ ${title} completed successfully!`);
	} catch (error) {
		spinner.stop(`❌ ${title} failed: ${(error as Error).message}`);
		throw error; // Rethrow the error to stop further execution
	}
}

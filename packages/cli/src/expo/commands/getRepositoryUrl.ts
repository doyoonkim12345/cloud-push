
import * as prompts from "@clack/prompts";
import { execa } from "execa";

export const getRepositoryUrl = async () => {
	const spinner = prompts.spinner();
	spinner.start("Getting git remote repository URL...");

	try {
		const { stdout: rawUrl } = await execa("git", [
			"config",
			"--get",
			"remote.origin.url",
		]);

		spinner.stop("✅ Repository URL retrieved successfully!");
		return rawUrl;
	} catch (e) {
		spinner.stop(`❌ Failed to get repository URL: ${(e as Error).message}`);
		throw e;
	}
};

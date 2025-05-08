import { execa } from "execa";
import * as prompts from "@clack/prompts";

export const getGitCommitHash = async () => {
	const spinner = prompts.spinner();

	spinner.start("Getting git commit hash...");

	try {
		const { stdout: gitHash } = await execa("git", [
			"rev-parse",
			"--short",
			"HEAD",
		]);

		if (!/^[0-9a-f]{7,40}$/.test(gitHash)) {
			throw new Error("Git hash format is invalid");
		}
		spinner.stop("✅ Getting git commit hash completed successfully!");
		return gitHash;
	} catch (e) {
		spinner.stop(`❌ Getting git commit hash failed: ${(e as Error).message}`);
		throw e; // 상위 호출자에게 오류 전파
	}
};

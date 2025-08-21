import { execa } from "execa";
import * as prompts from "@clack/prompts";

export const getGitCommitMessage = async () => {
    const spinner = prompts.spinner();
    spinner.start("Getting last git commit message…");

    try {
        // --pretty=%B → full commit message; -1 → most-recent (HEAD)
        const { stdout } = await execa("git", ["log", "-1", "--pretty=%B"]);
        const commitMessage = stdout.trim();

        if (!commitMessage) {
            throw new Error("Commit message is empty");
        }

        spinner.stop("✅ Got git commit message successfully!");
        return commitMessage;
    } catch (e) {
        spinner.stop(
            `❌ Getting git commit message failed: ${(e as Error).message}`,
        );
    }
};

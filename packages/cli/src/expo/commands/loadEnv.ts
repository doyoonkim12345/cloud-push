import { loadEASEnv } from "@/expo/lib/loadEASEnv";
import { loadFileEnv } from "@/expo/lib/loadFileEnv";
import type { ENV_SOURCE } from "@/types";
import * as prompts from "@clack/prompts";
import type { Environment } from "@cloud-push/cloud";

export async function loadEnv(envSource: ENV_SOURCE, environment: Environment) {
	const spinner = prompts.spinner();
	spinner.start("Loading env from Expo server ...");
	try {
		switch (envSource) {
			case "eas":
				await loadEASEnv(environment);
				break;
			case "file":
				await loadFileEnv(environment);
				break;
			default:
				throw new Error("Invalid env source");
		}

		spinner.stop("✅ Loading env completed successfully!");
	} catch (e) {
		spinner.stop(`❌ Loading env failed: ${(e as Error).message}`);
		throw new Error(
			"This project does not manage environment variables through EAS. Please upload the environment variables via eas env or expo.dev.",
		);
	}
}

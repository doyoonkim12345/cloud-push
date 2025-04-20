import type { ENV_SOURCE } from "@/features/env/types";
import * as prompts from "@clack/prompts";

export async function selectEnvSource(): Promise<ENV_SOURCE> {
	const envSource = (await prompts.select<ENV_SOURCE>({
		message: "Select environment",
		options: [
			{ value: "eas", label: "EAS" },
			{ value: "file", label: ".env" },
		],
	})) as ENV_SOURCE;

	// Handle prompt cancellation
	if (!envSource) {
		throw new Error("No environment selected. Exiting...");
	}

	return envSource;
}

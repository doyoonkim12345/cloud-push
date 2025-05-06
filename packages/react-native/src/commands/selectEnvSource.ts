import * as prompts from "@clack/prompts";

export async function selectEnvSource(): Promise<ENV_SOURCE> {
	const envSource = (await prompts.select<ENV_SOURCE>({
		message: "Select where to load environment variables from",
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

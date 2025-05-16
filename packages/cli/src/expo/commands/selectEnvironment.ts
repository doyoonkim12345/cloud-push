import * as prompts from "@clack/prompts";
import type { Environment } from "@cloud-push/cloud";

// Function to select environment
export async function selectEnvironment(
	defaultValue?: Environment,
): Promise<Environment> {
	if (
		defaultValue === "production" ||
		defaultValue === "development" ||
		defaultValue === "preview"
	) {
		prompts.log.success(`environment: ${defaultValue}`);
		return defaultValue;
	}

	const environment = (await prompts.select<Environment>({
		message: "Select environment",
		options: [
			{ value: "production", label: "production" },
			{ value: "development", label: "development" },
			{ value: "preview", label: "preview" },
		],
		initialValue: defaultValue,
	})) as Environment;

	if (!environment) {
		throw new Error("No environment selected. Exiting...");
	}

	return environment;
}

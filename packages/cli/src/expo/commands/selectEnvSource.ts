import type { ENV_SOURCE } from "@/types";
import * as prompts from "@clack/prompts";

export async function selectEnvSource(
	defaultValue?: ENV_SOURCE,
): Promise<ENV_SOURCE> {
	if (defaultValue === "eas" || defaultValue === "file") {
		prompts.log.success(`env source: ${defaultValue}`);
		return defaultValue;
	}

	const envSource = (await prompts.select<ENV_SOURCE>({
		message: "Select where to load environment variables from",
		options: [
			{ value: "eas", label: "EAS" },
			{ value: "file", label: ".env" },
		],
		initialValue: defaultValue,
	})) as ENV_SOURCE;

	if (!envSource) {
		throw new Error("No environment selected. Exiting...");
	}

	return envSource;
}

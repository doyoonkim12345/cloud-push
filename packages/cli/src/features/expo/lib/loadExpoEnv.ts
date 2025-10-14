import * as dotenv from "dotenv";
import type { Environment, ExpoClient } from "@cloud-push/cloud";
import * as prompts from "@clack/prompts";

export async function loadExpoEnv({
	environment,
	expoClient,
}: {
	environment?: Environment;
	expoClient: ExpoClient;
}) {
	const spinner = prompts.spinner();
	spinner.start("Loading Expo environment variables...");

	try {
		const envVars = await expoClient.fetchEnvVars({
			environment,
			includeSensitive: true,
		});

		const env = envVars.reduce((acc, curr) => {
			if (!curr.name) return acc;
			acc[curr.name] = curr.value ?? "";
			return acc;
		}, {} as Record<string, string>);

		dotenv.populate(process.env as any, env, { override: true });
		spinner.stop("Expo environment variables loaded successfully.");
	} catch (err) {
		spinner.stop("Failed to load Expo environment variables.");
		throw err;
	}
}

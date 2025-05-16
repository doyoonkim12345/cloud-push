import * as prompts from "@clack/prompts";
import type { Platform } from "@cloud-push/cloud";

// Function to select platforms
export async function selectPlatforms(): Promise<Platform[]> {
	const platforms = (await prompts.multiselect<Platform>({
		message: "Select platforms",
		options: [
			{ label: "Android", value: "android" },
			{ label: "Ios", value: "ios" },
		],
		initialValues: ["android", "ios"],
		required: true,
	})) as Platform[];

	// Handle prompt cancellation
	if (!platforms || platforms.length === 0) {
		throw new Error("No platforms selected. Exiting...");
	}

	return platforms;
}

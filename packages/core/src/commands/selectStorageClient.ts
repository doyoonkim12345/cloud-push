import * as prompts from "@clack/prompts";
import type { Storage } from "@/types";

// Function to select environment
export async function selectStorageClient(): Promise<Storage> {
	const storage = (await prompts.select<Storage>({
		message: "Select Storage client",
		options: [
			{ value: "AWS_S3", label: "AWS_S3" },
			{ value: "FIREBASE", label: "Firebase storage" },
			{ value: "SUPABASE", label: "Supabase R2" },
			{ value: "CUSTOM", label: "Custom" },
		],
		initialValue: "AWS_S3",
	})) as Storage;

	// Handle prompt cancellation
	if (!storage) {
		throw new Error("No DbClient selected. Exiting...");
	}

	return storage;
}

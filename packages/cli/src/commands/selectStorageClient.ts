import * as prompts from "@clack/prompts";
import { Storage } from "@cloud-push/cloud";

// Function to select environment
export async function selectStorageClient(): Promise<Storage> {
	const storage = (await prompts.select<Storage>({
		message: "Select Storage client",
		options: [
			{ value: "AWS_S3", label: "AWS_S3" },
			{ value: "FIREBASE", label: "Firebase storage" },
			{ value: "SUPABASE", label: "Supabase" },
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

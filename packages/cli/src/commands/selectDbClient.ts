import * as prompts from "@clack/prompts";
import type { Db } from "@cloud-push/cloud";

// Function to select environment
export async function selectDbClient(): Promise<Db> {
	const Db = (await prompts.select<Db>({
		message: "Select Db client",
		options: [
			{ value: "LOWDB", label: "Lowdb(json)" },
			{ value: "FIREBASE", label: "Firebase firestore" },
			{ value: "SUPABASE", label: "Supabase" },
			{ value: "CUSTOM", label: "Custom" },
		],
		initialValue: "LOWDB",
	})) as Db;

	// Handle prompt cancellation
	if (!Db) {
		throw new Error("No DbClient selected. Exiting...");
	}

	return Db;
}

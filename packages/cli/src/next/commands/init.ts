import * as prompts from "@clack/prompts";
import { selectDbClient, selectStorageClient } from "@/commands";
import { movePngs, renderTemplates } from "@/next/lib/renderTemplates";

export const init = async () => {
	try {
		const db = await selectDbClient();
		const storage = await selectStorageClient();

		await renderTemplates({ db, storage });
		await movePngs();
		prompts.outro("Config Generated Successfully! 🎉");
	} catch (e) {
		console.error(e);
		prompts.outro("Config Generation failed");
	}
};

import * as prompts from "@clack/prompts";
import { selectStorageClient } from "@/commands";
import { movePngs, renderTemplates } from "@/next/lib/renderTemplates";

export const init = async () => {
	try {
		const storage = await selectStorageClient();

		await renderTemplates({ storage });
		await movePngs();
		prompts.outro("Config Generated Successfully! 🎉");
	} catch (e) {
		console.error(e);
		prompts.outro("Config Generation failed");
	}
};

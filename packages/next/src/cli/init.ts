import * as prompts from "@clack/prompts";
import { selectDbClient, selectStorageClient } from "@cloud-push/core/node";
import { movePngs, renderTemplates } from "@/nodeUtils/renderTemplates";

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

import * as path from "node:path";
import * as fs from "node:fs";
import * as prompts from "@clack/prompts";
import { createConfigTemplate } from "@/lib/createTemplate";
import {
	getCwd,
	selectDbClient,
	selectStorageClient,
} from "@cloud-push/core/node";

export const init = async () => {
	try {
		const db = await selectDbClient();
		const storage = await selectStorageClient();

		const template = createConfigTemplate({ db, storage });

		const cwd = getCwd();

		const filePath = path.resolve(cwd, "cloud-push.config.ts");
		fs.writeFileSync(filePath, template.trimStart(), "utf8");
		prompts.outro("Config Generated Successfully! 🎉");
	} catch (e) {
		console.error(e);
		prompts.outro("Config Generation failed");
	}
};

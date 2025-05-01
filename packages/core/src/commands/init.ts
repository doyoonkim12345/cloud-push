import * as path from "node:path";
import * as fs from "node:fs";

import * as prompts from "@clack/prompts";
import { selectStorageClient } from "./selectStorageClient";
import { selectDbClient } from "./selectDbClient";
import { getCwd } from "@/utils/getCwd";
import { createConfigTemplate, type TemplateFrom } from "@/config";

export const init = async (where: TemplateFrom) => {
	try {
		const db = await selectDbClient();
		const storage = await selectStorageClient();

		const template = createConfigTemplate({ db, storage, where });

		const cwd = getCwd();

		const filePath = path.resolve(cwd, "cloud-push.config.ts");
		fs.writeFileSync(filePath, template.trimStart(), "utf8");
		prompts.outro("Config Generated Successfully! 🎉");
	} catch (e) {
		console.error(e);
		prompts.outro("Config Generation failed");
	}
};

import * as path from "node:path";
import * as fs from "node:fs";
import * as prompts from "@clack/prompts";
import { createServerTemplate } from "./createServerTemplate";
import { createBrowserTemplate } from "./createBrowserTemplate";
import {
	getCwd,
	selectDbClient,
	selectStorageClient,
} from "@cloud-push/core/node";

export const init = async () => {
	try {
		const db = await selectDbClient();
		const storage = await selectStorageClient();

		const serverTemplate = createServerTemplate({ db, storage });
		const browserTemplate = createBrowserTemplate();
		const cwd = getCwd();

		const serverFilePath = path.resolve(cwd, "cloud-push.server.ts");
		fs.writeFileSync(serverFilePath, serverTemplate.trimStart(), "utf8");

		const browserFilePath = path.resolve(cwd, "cloud-push.browser.ts");
		fs.writeFileSync(browserFilePath, browserTemplate.trimStart(), "utf8");

		prompts.outro("Config Generated Successfully! 🎉");
	} catch (e) {
		console.error(e);
		prompts.outro("Config Generation failed");
	}
};

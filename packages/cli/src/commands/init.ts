import * as path from "node:path";
import * as fs from "node:fs";
import * as prompts from "@clack/prompts";
<<<<<<< Updated upstream:packages/cli/src/expo/commands/init.ts
import { selectStorageClient } from "@/commands";
import { createConfigTemplate } from "@/expo/lib/createTemplate";
import { getCwd } from "@/lib/getCwd";
=======
import { createConfigTemplate } from "@/lib/createTemplate";
import { getCwd } from "@cloud-push/cloud";
import { selectStorageClient } from "./selectStorageClient";
>>>>>>> Stashed changes:packages/cli/src/commands/init.ts

export const init = async () => {
	try {
		const storage = await selectStorageClient();

		const template = createConfigTemplate({ storage });

		const cwd = getCwd();

		const filePath = path.resolve(cwd, "cloud-push.config.ts");
		fs.writeFileSync(filePath, template.trimStart(), "utf8");
		prompts.outro("Config Generated Successfully! 🎉");
	} catch (e) {
		prompts.log.error("Config Generation failed");
	}
};

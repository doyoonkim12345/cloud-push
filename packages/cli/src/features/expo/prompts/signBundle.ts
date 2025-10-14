import path from "node:path";
import fs from "node:fs";
import * as prompts from "@clack/prompts";
<<<<<<<< Updated upstream:packages/cli/src/expo/features/expo/prompts/signBundle.ts
import { getCwd } from "@/lib/getCwd";
import { signFile } from "@/expo/lib/signBundle";
========
import { getCwd } from "@cloud-push/cloud";
import { signFile } from "@/lib/signBundle";
>>>>>>>> Stashed changes:packages/cli/src/features/expo/prompts/signBundle.ts

const filesToSign = [
	"dist/manifest.json",
	"dist/android-index.bundle",
	"dist/ios-index.bundle",
];

export function signBundle({ privateKeyPath }: { privateKeyPath: string }) {
	const cwd = getCwd();

	const privateKeyFullPath = path.join(cwd, privateKeyPath);

	const spinner = prompts.spinner();

	spinner.start("Signing bundle...");

	try {
		for (const file of filesToSign) {
			const fileFullPath = path.join(cwd, file);

			const signature = signFile(file, privateKeyFullPath);
			const outPath = `${fileFullPath}.sig`;

			fs.writeFileSync(outPath, signature);
			prompts.log.info(`✅ Signed ${fileFullPath} → ${outPath}`);
		}
		spinner.stop("✅ Signing bundle completed successfully!");
	} catch (e) {
		spinner.stop("❌ Signing bundle failed!");
		throw e;
	}
}

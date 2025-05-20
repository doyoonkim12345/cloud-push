import { getCwd } from "@cloud-push/cloud";
import { signFile } from "../lib/signBundle";
import path from "node:path";
import fs from "node:fs";
import * as prompts from "@clack/prompts";

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
			console.log(`✅ Signed ${fileFullPath} → ${outPath}`);
		}
		spinner.stop("✅ Signing bundle completed successfully!");
	} catch (e) {
		spinner.stop("❌ Signing bundle failed!");
		throw e;
	}
}

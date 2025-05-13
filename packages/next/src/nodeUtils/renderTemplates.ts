import type { Db, Storage } from "@cloud-push/core";
import { getCwd } from "@cloud-push/core/node";
import { renderFile } from "ejs";
import { copy, outputFile } from "fs-extra";
import { globby } from "globby";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "templates");

const cwd = getCwd();

const outDir = path.resolve(cwd); // 원하는 출력 디렉토리

export async function renderTemplates(params: { db: Db; storage: Storage }) {
	const files = await globby("**/*.ejs", { cwd: srcDir });

	for (const file of files) {
		const fullPath = path.join(srcDir, file);
		const rendered = await renderFile(fullPath, params, { async: true });

		const outPath = path.join(outDir, file.replace(/\.ejs$/, ""));
		await outputFile(outPath, rendered);
		console.log(`✅ Rendered: ${file} → ${outPath}`);
	}
}

export async function movePngs() {
	const files = await globby("**/*.png", { cwd: srcDir });
	for (const file of files) {
		const fullPath = path.join(srcDir, file);
		const outPath = path.join(outDir, file);
		await copy(fullPath, outPath);
		console.log(`✅ Copied: ${file} → ${outPath}`);
	}
}

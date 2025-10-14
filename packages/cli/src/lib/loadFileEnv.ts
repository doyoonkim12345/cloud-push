import * as dotenv from "dotenv";
import * as path from "node:path";
import { promises as fs } from "node:fs";
import { getCwd, type Environment } from "@cloud-push/cloud";
import * as prompts from "@clack/prompts";

export async function loadFileEnv(environment?: Environment) {
	const spinner = prompts.spinner();
	spinner.start(`Loading local env files for "${environment}"...`);

	// 환경별 파일 설정
	const envFiles = [
		environment ? `.env.${environment}.local` : null, // 예: .env.development.local
		".env.local", // 모든 환경에서 사용되지만 test 환경 제외
		environment ? `.env.${environment}` : null, // 예: .env.development
		".env", // 기본 파일
	].filter(Boolean).map((e) => e!);

	let loaded = false;

	for (const file of envFiles) {
		const filePath = path.resolve(getCwd(), file);
		try {
			await fs.access(filePath);
			dotenv.config({ path: filePath, override: true });
			loaded = true;
		} catch {
			// 파일 없을 경우 무시
		}
	}

	if (loaded) {
		spinner.stop(`Environment files for "${environment}" loaded.`);
	} else {
		spinner.stop(`No environment files found for "${environment}".`);
	}
}

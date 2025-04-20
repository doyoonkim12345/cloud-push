import type { Environment } from "@cloud-push/core";
import * as dotenv from "dotenv";
import { getCwd } from "@/lib/getCwd";
import * as path from "node:path";
import { promises as fs } from "node:fs";

export async function loadFileEnv(environment: Environment) {
	// 환경별 파일 설정
	const envFiles = [
		`.env.${environment}.local`, // 예: .env.development.local
		".env.local", // 모든 환경에서 사용되지만 test 환경 제외
		`.env.${environment}`, // 예: .env.development
		".env", // 기본 파일
	];

	for (const file of envFiles) {
		const filePath = path.resolve(getCwd(), file);
		try {
			// 비동기로 파일 존재 여부 확인
			await fs.access(filePath);
			// 파일이 존재하면 로드
			dotenv.config({ path: filePath, override: true });
		} catch (error) {}
	}
}

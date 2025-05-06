import { rm } from "node:fs/promises";
import * as prompts from "@clack/prompts";

export async function cleanup(bundlePath: string): Promise<void> {
	try {
		// 주석 처리된 부분 그대로 유지, 필요한 경우 주석 제거
		await rm(bundlePath, { recursive: true, force: true });
		prompts.log.error("Cleaned up temporary files.");
	} catch (err) {
		// Ignore if file doesn't exist
		prompts.log.error(err as any);
	}
}

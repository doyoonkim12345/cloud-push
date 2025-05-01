"use server";

export * from "@/lib";

import { init } from "@cloud-push/core";
import { Command } from "commander";
import type { DbClient, StorageClient } from "@cloud-push/cloud";

export type Config = {
	storage: StorageClient;
	db: DbClient;
};

export const defineConfig = async (config: () => Promise<Config> | Config) => {
	const definedConfig = await config();
	return definedConfig;
};

// const program = new Command();

// // CLI 버전 및 설명 설정
// program.name("cloud-push");

// program.command("init").action(() => init("next"));

// // 프로그램 실행
// program.parse(process.argv);

// // 명령어가 제공되지 않았다면 도움말 표시
// if (!process.argv.slice(2).length) {
// 	program.outputHelp();
// }

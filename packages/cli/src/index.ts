#!/usr/bin/env node

import { Command } from "commander";
import * as prompts from "@clack/prompts";
import { init as expoInit } from '@/expo/commands/init'
import { init as nextInit } from '@/next/commands/init'
import { deploy } from "./expo/commands/deploy";

const program = new Command();

// Graceful exit flag
let isExiting = false;

// Handle process interruption (e.g., Ctrl+C)
process.on("SIGINT", async () => {
	if (isExiting) return; // Prevent multiple executions
	isExiting = true;

	prompts.log.error("\n\n🛑 Process interrupted. Cleaning up...");
	// Add any additional cleanup logic here (if needed)
	process.exit(1);
});

program.command("deploy").description("Upload bundle").action(deploy);
program.command("next-init").action(nextInit);
program.command("expo-init").action(expoInit);

// 프로그램 실행
program.parse(process.argv);

// 명령어가 제공되지 않았다면 도움말 표시
if (!process.argv.slice(2).length) {
	program.outputHelp();
}

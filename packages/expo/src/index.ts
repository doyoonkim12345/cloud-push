#!/usr/bin/env node

import { Command } from "commander";
import * as prompts from "@clack/prompts";
import { deploy } from "./commands/deploy";
import { init } from "./commands/init";

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
program.command("init").action(init);

// 프로그램 실행
program.parse(process.argv);

// 명령어가 제공되지 않았다면 도움말 표시
if (!process.argv.slice(2).length) {
	program.outputHelp();
}

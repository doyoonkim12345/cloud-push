#!/usr/bin/env node

import { Command } from "commander";
import * as prompts from "@clack/prompts";
import { init as expoInit } from '@/expo/commands/init'
import { init as nextInit } from '@/next/commands/init'
import { update } from "./expo/commands/update";
import { republish } from "./expo/commands/republish";

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


program.command('update')
	.option("-m, --message <value>", "A short message describing the update")
	.option("-p, --platform <android|ios|all>", "Target platform", "all")
	.option("--auto", "Use current git branch and commit message", false)
	.option("--branch <value>", "Branch to publish the update group on")
	.option("--channel <value>", "Channel affected by this update")
	.option("--clear-cache", "Clear bundler cache before publishing", false)
	// .option("--emit-metadata", "Emit eas-update-metadata.json in bundle dir", false)
	.option(
		"--environment <env>",
		"Environment to use (development|preview|production)"
	)
	.option("--env-source <eas|dotenv>", "Environment variable to use", "eas")
	.option("--input-dir <value>", "Location of the bundle dir", "dist")
	.option("--non-interactive", "Run in CI-compatible mode", false)
	.option("--private-key-path <value>", "PEM file path for code signing")
	.option(
		"--rollout-percentage <value>",
		"Percentage of users to receive this update",
		(value) => parseInt(value, 10)
	)
	.option("--skip-bundler", "Skip running Expo bundler")
	.description(
		"Upload a new OTA bundle to cloud‑push storage and register it in cursor.json"
	)
	.action(update)

program.command("republish")
	.option("-m, --message=<value>", "Short message describing the republished update group")
	.option("-p, --platform <android|ios|all>", "Target platform", "all")
	.option("--branch=<value>", "Branch name to select an update group to republish from")
	.option("--channel=<value>", "Channel name to select an update group to republish from")
	.option("--destination-branch=<value>", "Branch name to republish to if republishing to a different branch")
	.option("--destination-channel=<value>", "Channel name to select a branch to republish to if republishing to a different branch")
	.option("--group=<value>", "Update group ID to republish")
	.option("--env-source <eas|dotenv>", "Environment variable to use", "eas")
	.option("--private-key-path=<value>", `File containing the PEM-encoded private key corresponding to the certificate in expo-updates' configuration. Defaults to a file named "private-key.pem" in the certificate's directory. Only relevant if you are using code signing: https://docs.expo.dev/eas-update/code-signing/`)
	.option("--rollout-percentage=<value>", "Percentage of users this update should be immediately available to. Users not in the rollout will be served the previous latest update on the branch, even if that update is itself being rolled out. The specified number must be an integer between 1 and 100. When not specified, this defaults to 100.")
	.description("Republish an update group")
	.action(republish)

program.command("next-init").action(nextInit);
program.command("expo-init").action(expoInit);

// 프로그램 실행
program.parse(process.argv);

// 명령어가 제공되지 않았다면 도움말 표시
if (!process.argv.slice(2).length) {
	program.outputHelp();
}

#!/usr/bin/env node

import { Command } from "commander";
import { banner } from "@/components/banner";
import { getCwd } from "@/lib/getCwd";
import { loadConfig } from "@/lib/loadConfig";
import * as path from "path";
import { unlink } from "fs/promises";
import * as prompts from "@clack/prompts";
import { selectPlatforms } from "./commands/selectPlatforms";
import { selectEnvironment } from "./commands/selectEnvironment";
import { getRuntimeVersion } from "./commands/getRuntimeVersion";
import { exportBundles } from "./commands/exportBundles";
import { zipBundles } from "./commands/zipBundles";
import { uploadBundles } from "./commands/uploadBundles";

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

// CLI 버전 및 설명 설정
program.name("eas-update").description(banner).version("1.0.0");

// Function to load configuration
async function loadConfiguration() {
  // Replace this with your actual configuration loading logic
  const config = await loadConfig(); // Assume loadConfig is a valid function
  return config;
}

// 명령어 추가
program
  .command("deploy")
  .description("Upload bundle")
  .action(async () => {
    const cwd = getCwd();

    const bundlePath = path.resolve(cwd, "./dist");
    const zippedBundlePath = path.resolve(cwd, "./dist.zip");

    try {
      const platforms = await selectPlatforms();
      const environment = await selectEnvironment();
      const config = await loadConfiguration();
      const runtimeVersion = await getRuntimeVersion(config.runtimeVersion);
      await exportBundles({ platforms, bundlePath });
      await zipBundles({ bundlePath, zippedBundlePath });
      await uploadBundles({
        zippedBundlePath,
        runtimeVersion,
        environment,
        config,
      });
      prompts.outro("🚀 Deployment Successful");
    } catch (e) {
      console.error(e as any);
      prompts.outro("Deployment failed");
    } finally {
      // Cleanup logic
      try {
        await unlink(zippedBundlePath);
        prompts.log.error("Cleaned up temporary files.");
      } catch (err) {
        // Ignore if file doesn't exist
        prompts.log.error(err as any);
      }
    }
  });

// 프로그램 실행
program.parse(process.argv);

// 명령어가 제공되지 않았다면 도움말 표시
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

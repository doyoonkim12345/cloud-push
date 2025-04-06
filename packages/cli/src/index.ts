#!/usr/bin/env node

import { Command } from "commander";
import { banner } from "@/components/banner";
import { getCwd } from "@/lib/getCwd";
import { loadConfig } from "@/lib/loadConfig";
import * as path from "path";
import { rm } from "fs/promises";
import * as prompts from "@clack/prompts";
import { selectPlatforms } from "./commands/selectPlatforms";
import { selectEnvironment } from "./commands/selectEnvironment";
import { getRuntimeVersion } from "./commands/getRuntimeVersion";
import { exportBundles } from "./commands/exportBundles";
import { v4 as uuidv4 } from "uuid";
import { createJsonFile } from "@cloud-push/core/utils";
import s3Client from "@cloud-push/core/s3";
import { exportExpoConfig } from "./commands/exportExpoConfig";
import { VersionCursorStore } from "@cloud-push/core/version-cursor";
import { loadEnv } from "./features/env/lib/loadEnv";

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
program.name("cloud-push").description(banner).version("1.0.0");

// 명령어 추가
program
  .command("deploy")
  .description("Upload bundle")
  .action(async () => {
    const cwd = getCwd();

    const bundlePath = path.resolve(cwd, "./dist");

    try {
      const platforms = await selectPlatforms();
      const environment = await selectEnvironment();
      const config = await loadConfig();
      const runtimeVersion = await getRuntimeVersion(config.runtimeVersion);
      await exportBundles({ platforms, bundlePath });

      const env = await loadEnv(config.envSource, environment, [
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_REGION",
        "AWS_BUCKET_NAME",
      ]);

      await exportExpoConfig({ env, expoConfigPath: bundlePath });

      const bundleId = uuidv4();

      switch (config.storage) {
        case "AWS_S3":
          const s3Key = `${runtimeVersion}/${environment}/${bundleId}`;

          const client = s3Client({
            region: env.AWS_REGION,
            credentials: {
              accessKeyId: env.AWS_ACCESS_KEY_ID,
              secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            },
          });

          const spinner = prompts.spinner();
          spinner.start("Preparing file upload...");

          try {
            await client.uploadDirectory({
              bucketName: env.AWS_BUCKET_NAME,
              s3Path: s3Key,
              directoryPath: bundlePath,
            });

            spinner.stop("✅ Uploading completed successfully!");
          } catch (e) {
            spinner.stop(`❌ Uploading failed: ${(e as Error).message}`);
          }

          const cursorSpinner = prompts.spinner();
          cursorSpinner.start("Version cursor updating...");

          try {
            let file: File | null;
            try {
              file = await client.getFile({
                bucketName: env.AWS_BUCKET_NAME,
                key: "cursor.json",
              });
            } catch (e) {
              file = null;
            }

            const versionCursorStore = new VersionCursorStore();

            if (file) {
              await versionCursorStore.loadFromJSON(file);
            } else {
              prompts.log.info(
                "The version cursor does not exist, so a version cursor will be created."
              );
            }

            versionCursorStore.addVersion(bundleId, {
              createdAt: Date.now(),
              environment,
              gitHash: "",
              platforms,
              runtimeVersion,
            });

            const cursorJson = createJsonFile(
              versionCursorStore.serialize(),
              "cursor.json"
            );

            await client.uploadFile({
              file: cursorJson,
              bucketName: env.AWS_BUCKET_NAME,
              key: "cursor.json",
            });

            cursorSpinner.stop(
              "✅ Updating version cursor completed successfully!"
            );
          } catch (e) {
            cursorSpinner.stop(
              `❌ Uploading version cursor failed:failed successfully! ${
                (e as Error).message
              }`
            );
          }

          break;
        default:
          break;
      }

      prompts.outro("🚀 Deployment Successful");
    } catch (e) {
      console.error(e as any);
      prompts.outro("Deployment failed");
    } finally {
      // Cleanup logic
      try {
        await rm(bundlePath, { recursive: true, force: true });
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

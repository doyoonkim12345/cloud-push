#!/usr/bin/env node

import { Command } from "commander";
import { banner } from "@/components/banner";
import checkPackageAvailable from "@/lib/checkPackageAvailable";
import { execa } from "execa";
import { getCwd } from "@/lib/getCwd";
import zip from "@/lib/zip";
import uploadS3 from "@/lib/uploadS3";
import { loadConfig } from "@/lib/loadConfig";
import * as path from "path";
import { unlink } from "fs/promises";
import loadEnv from "@/lib/loadEnv";
import * as prompts from "@clack/prompts";
import { Environment, Platform } from "./types";
import semver from "semver";

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

// 명령어 추가
program
  .command("deploy")
  .description("Upload bundle")
  .action(async () => {
    const cwd = getCwd();

    const bundlePath = path.resolve(cwd, "./dist");
    const zippedBundlePath = path.resolve(cwd, "./dist.zip");

    try {
      const platforms = (await prompts.multiselect<Platform>({
        message: "Select platforms",
        options: [
          { label: "Android", value: "ANDROID" },
          { label: "Ios", value: "IOS" },
        ],
        initialValues: ["ANDROID", "IOS"],
        required: true,
      })) as Platform[];

      // Handle prompt cancellation
      if (!platforms || platforms.length === 0) {
        throw new Error("No platforms selected. Exiting...");
      }

      const environment = (await prompts.select<Environment>({
        message: "Select environment",
        options: [
          {
            value: "PRODUCTION",
            label: "production",
          },
          {
            value: "DEVELOPMENT",
            label: "development",
          },
          {
            value: "PREVIEW",
            label: "preview",
          },
        ],
        initialValue: "PRODUCTION",
      })) as Environment;

      // Handle prompt cancellation
      if (!environment) {
        throw new Error("No environment selected. Exiting...");
      }

      const config = await loadConfig();

      let runtimeVersion = config.runtimeVersion;

      if (runtimeVersion && semver.valid(runtimeVersion)) {
        prompts.log.success(`runtimeVersion : ${runtimeVersion}`);
      } else {
        runtimeVersion = (await prompts.text({
          message: "What runtimeVersion would you like to set?",
          placeholder: "1.0.0",
          validate: (value) => {
            if (!semver.valid(value)) {
              return new Error(
                "Please enter a valid semantic version (e.g., 1.0.0)"
              );
            }
          },
        })) as string;

        if (typeof runtimeVersion !== "string") {
          throw new Error("No runtimeVersion");
        }
      }

      await prompts.tasks([
        {
          title: `Exporting ${platforms
            .join(", ")
            .toLocaleLowerCase()} bundles`,
          task: async () => {
            await checkPackageAvailable("expo", "52.x.x");
            await execa("expo", [
              "export",
              ...platforms.flatMap((platform) => [
                "--platform",
                platform.toLocaleLowerCase(),
              ]),
              ...["--output-dir", bundlePath],
            ]);
          },
        },
        {
          title: "Zipping bundles",
          task: async () => {
            await zip(bundlePath, zippedBundlePath);
          },
        },
        {
          title: "Uploading bundles",
          task: async () => {
            switch (config.storage) {
              case "AWS_S3":
                const env = await loadEnv([
                  "AWS_ACCESS_KEY_ID",
                  "AWS_SECRET_ACCESS_KEY",
                  "AWS_REGION",
                  "AWS_BUCKET_NAME",
                ]);
                await uploadS3(
                  zippedBundlePath,
                  `${runtimeVersion}/${environment}/${Date.now()}.zip`,
                  {
                    accessKeyId: env.AWS_ACCESS_KEY_ID,
                    bucketName: env.AWS_BUCKET_NAME,
                    region: env.AWS_REGION,
                    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
                  }
                );
                break;
              default:
                throw new Error(
                  "Please check the storage settings in the config"
                );
            }
          },
        },
      ]);
      prompts.outro("🚀 Deployment Successful");
    } catch (e) {
      prompts.log.error(e as any);
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

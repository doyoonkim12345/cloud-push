import loadEnv from "@/lib/loadEnv";
import uploadS3 from "@/lib/uploadS3";
import * as prompts from "@clack/prompts";

interface UploadBundlesProps {
  zippedBundlePath: string;
  runtimeVersion: string;
  environment: string;
  config: {
    storage: string;
  };
}

export async function uploadBundles({
  zippedBundlePath,
  runtimeVersion,
  environment,
  config,
}: UploadBundlesProps): Promise<void> {
  const spinner = prompts.spinner();
  spinner.start("Uploading bundles...");

  try {
    if (config.storage === "AWS_S3") {
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

      spinner.stop("✅ Uploading completed successfully!");
    } else {
      throw new Error("Please check the storage settings in the config");
    }
  } catch (error) {
    spinner.stop(`❌ Uploading failed: ${(error as Error).message}`);
    throw error; // Rethrow the error to stop further execution
  }
}

import zipDistFolder from "@/lib/zip";
import * as prompts from "@clack/prompts";

interface ZipBundlesProps {
  bundlePath: string;
  zippedBundlePath: string;
}

// Function to zip bundles
export async function zipBundles({
  bundlePath,
  zippedBundlePath,
}: ZipBundlesProps): Promise<void> {
  const spinner = prompts.spinner();
  spinner.start("Zipping bundles...");

  try {
    await zipDistFolder(bundlePath, zippedBundlePath); // Replace with your actual zipping logic
    spinner.stop("✅ Zipping completed successfully!");
  } catch (error) {
    spinner.stop(`❌ Zipping failed: ${(error as Error).message}`);
    throw error; // Rethrow the error to stop further execution
  }
}

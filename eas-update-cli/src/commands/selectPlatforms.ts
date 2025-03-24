import { Platform } from "@/types";
import * as prompts from "@clack/prompts";

// Function to select platforms
export async function selectPlatforms(): Promise<Platform[]> {
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

  return platforms;
}

import { Environment } from "@/types";
import * as prompts from "@clack/prompts";

// Function to select environment
export async function selectEnvironment(): Promise<Environment> {
  const environment = (await prompts.select<Environment>({
    message: "Select environment",
    options: [
      { value: "PRODUCTION", label: "production" },
      { value: "DEVELOPMENT", label: "development" },
      { value: "PREVIEW", label: "preview" },
    ],
    initialValue: "PRODUCTION",
  })) as Environment;

  // Handle prompt cancellation
  if (!environment) {
    throw new Error("No environment selected. Exiting...");
  }

  return environment;
}

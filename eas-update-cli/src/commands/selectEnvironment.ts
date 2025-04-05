import * as prompts from "@clack/prompts";
import { type Environment } from "eas-update-core";

// Function to select environment
export async function selectEnvironment(): Promise<Environment> {
  const environment = (await prompts.select<Environment>({
    message: "Select environment",
    options: [
      { value: "production", label: "production" },
      { value: "development", label: "development" },
      { value: "preview", label: "preview" },
    ],
    initialValue: "production",
  })) as Environment;

  // Handle prompt cancellation
  if (!environment) {
    throw new Error("No environment selected. Exiting...");
  }

  return environment;
}

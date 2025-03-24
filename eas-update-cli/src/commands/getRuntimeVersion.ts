import * as prompts from "@clack/prompts";
import semver from "semver";

// Function to validate and get runtime version
export async function getRuntimeVersion(
  configRuntimeVersion?: string
): Promise<string> {
  let runtimeVersion = configRuntimeVersion;

  if (runtimeVersion && semver.valid(runtimeVersion)) {
    prompts.log.success(`runtimeVersion: ${runtimeVersion}`);
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
      throw new Error("No runtimeVersion provided. Exiting...");
    }
  }

  return runtimeVersion;
}

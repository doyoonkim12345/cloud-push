import * as prompts from "@clack/prompts";
import { Environment } from "@cloud-push/core";
import { ENV_KEY, ENV_SOURCE } from "../types";
import { loadEASEnv } from "./loadEASEnv";
import { loadFileEnv } from "./loadFileEnv";

export async function loadEnv<T extends ENV_KEY>(
  envSource: ENV_SOURCE,
  environment: Environment,
  keys: T[]
) {
  const spinner = prompts.spinner();
  spinner.start(`Loading env from Expo server ...`);
  try {
    let env: { [key in T]: string };
    switch (envSource) {
      case "eas":
        env = await loadEASEnv(environment, keys);
        break;
      case "file":
        env = await loadFileEnv(environment, keys);
        break;
      default:
        throw new Error("Invalid env source");
    }

    spinner.stop(`✅ Loading env completed successfully!`);
    return env;
  } catch (e) {
    spinner.stop(`❌ Loading env failed: ${(e as Error).message}`);
    throw new Error(
      "This project does not manage environment variables through EAS. Please upload the environment variables via eas env or expo.dev."
    );
  }
}

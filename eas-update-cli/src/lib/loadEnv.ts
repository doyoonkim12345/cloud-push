import { execa } from "execa";
import * as prompts from "@clack/prompts";
import { Environment } from "@/types";
import { parseEnv } from "./parseEnv";

type S3_KEY =
  | "AWS_BUCKET_NAME"
  | "AWS_REGION"
  | "AWS_SECRET_ACCESS_KEY"
  | "AWS_ACCESS_KEY_ID";

export default async function loadEnv<T extends S3_KEY>(
  environment: Environment,
  keys: T[]
): Promise<{ [key in T]: string }> {
  const spinner = prompts.spinner();
  spinner.start(`Loading env from Expo server ...`);

  try {
    const { stdout } = await execa(
      "eas",
      [
        "env:exec",
        environment,
        `node -e "console.log({${keys
          .map((key) => [key, `process.env.${key}`].join(":"))
          .join(",")}})"`,
      ],
      { stdio: "pipe" }
    );

    const parsedEnv = parseEnv<any>(stdout);
    spinner.stop(`✅ Loading env completed successfully!`);
    return parsedEnv;
  } catch (e) {
    spinner.stop(`❌ Loading env failed: ${(e as Error).message}`);
    throw new Error(
      "This project does not manage environment variables through EAS. Please upload the environment variables via eas env or expo.dev."
    );
  }
}

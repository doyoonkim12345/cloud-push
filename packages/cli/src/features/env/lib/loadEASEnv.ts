import { execa } from "execa";
import { type Environment } from "@cloud-push/core";
import { parseStdout } from "@/lib/parseStdout";
import { ENV_KEY } from "../types";

export async function loadEASEnv<T extends ENV_KEY>(
  environment: Environment,
  keys: T[]
): Promise<{ [key in T]: string }> {
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

  const parsedEnv = parseStdout<any>(stdout);

  return parsedEnv;
}

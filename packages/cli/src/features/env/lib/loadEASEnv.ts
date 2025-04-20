import { execa } from "execa";
import { type Environment } from "@cloud-push/core";
import { parseStdout } from "@/lib/parseStdout";
import * as dotenv from "dotenv";

export async function loadEASEnv(environment: Environment) {
  const { stdout } = await execa("eas", ["env:list", environment], {
    stdio: "pipe",
  });

  const parsedEnv = parseStdout<any>(stdout);

  dotenv.populate(process.env as any, parsedEnv, { override: true });
}

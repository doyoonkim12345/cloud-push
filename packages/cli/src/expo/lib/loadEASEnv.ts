import { execa } from "execa";
import * as dotenv from "dotenv";
import type { Environment } from "@cloud-push/cloud";
import { parseStdout } from "@/expo/lib/parseStdout";

export async function loadEASEnv(environment: Environment) {
	const { stdout } = await execa("eas", ["env:list", environment], {
		stdio: "pipe",
	});

	const parsedEnv = parseStdout<any>(stdout);

	dotenv.populate(process.env as any, parsedEnv, { override: true });
}

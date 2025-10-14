import { getCwd } from "@cloud-push/cloud";
import { getConfig } from "@expo/config";
import path from "node:path";

export const getExpoConfig = async () => {
    const projectDir = path.resolve(getCwd());
    return getConfig(projectDir);
}
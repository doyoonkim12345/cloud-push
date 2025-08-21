import { getCwd } from "@/lib/getCwd";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const loadEasJson = async () => {
    const easJsonPath = path.join(getCwd(), "eas.json")
    if (!existsSync(easJsonPath)) {
        throw new Error("eas.json not found")
    }
    const easJson = await readFile(path.join(getCwd(), "eas.json"), "utf8")
    return JSON.parse(easJson)
}
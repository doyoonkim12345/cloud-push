import path from "node:path";
import fs from "node:fs/promises";

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
    const absolutePath = path.resolve(filePath); // 상대경로 → 절대경로로 변환
    const content = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(content);
};

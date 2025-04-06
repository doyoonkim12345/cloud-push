import { Environment } from "@cloud-push/core";
import { ENV_KEY } from "../types";
import * as dotenv from "dotenv";
import { getCwd } from "@/lib/getCwd";
import * as path from "path";
import { promises as fs } from "fs";

export async function loadFileEnv<T extends ENV_KEY>(
  environment: Environment,
  keys: T[]
): Promise<{ [key in T]: string }> {
  // 환경별 파일 설정
  const envFiles = [
    `.env.${environment}.local`, // 예: .env.development.local
    `.env.local`, // 모든 환경에서 사용되지만 test 환경 제외
    `.env.${environment}`, // 예: .env.development
    `.env`, // 기본 파일
  ];

  for (const file of envFiles) {
    const filePath = path.resolve(getCwd(), file);
    try {
      // 비동기로 파일 존재 여부 확인
      await fs.access(filePath);
      // 파일이 존재하면 로드
      dotenv.config({ path: filePath });
    } catch (error) {}
  }

  const env = keys.reduce((acc, key) => {
    const value = process.env[key];
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {} as { [key in T]: string });

  return env;
}

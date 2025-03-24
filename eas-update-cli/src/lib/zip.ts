import * as path from "path";
import * as fsPromises from "fs/promises";
import { zipSync } from "fflate";
import fastGlob from "fast-glob";

/**
 * dist 폴더를 압축하는 함수 (fflate 라이브러리 사용)
 * @param sourceDir 압축할 소스 디렉토리 경로
 * @param outputFile 출력 zip 파일 경로
 */
export default async function zipDistFolder(
  sourceDir: string,
  outputFile: string
): Promise<void> {
  try {
    // 출력 디렉토리가 존재하는지 확인하고 필요하면 생성
    const outputDir = path.dirname(outputFile);
    await fsPromises.mkdir(outputDir, { recursive: true });

    // 소스 디렉토리 내의 모든 파일을 재귀적으로 읽기
    const files = await fastGlob(sourceDir, { onlyFiles: true });

    // zip 객체 생성
    const zipObj: Record<string, Uint8Array> = {};

    // 모든 파일 처리
    for (const filePath of files) {
      // 상대 경로 계산
      const relativePath = path.relative(sourceDir, filePath);
      // 파일 내용 읽기
      const content = await fsPromises.readFile(filePath);
      // zip 객체에 추가
      zipObj[relativePath] = new Uint8Array(content);
    }

    // 압축 수행
    const zipData = zipSync(zipObj, { level: 9 }); // 최대 압축 레벨

    // 파일에 쓰기
    await fsPromises.writeFile(outputFile, zipData);
  } catch (error) {
    throw error;
  }
}

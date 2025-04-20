export function parseFileAsJson<T = any>(buffer: Buffer) {
  try {
    const text = buffer.toString("utf-8"); // Buffer를 문자열로 변환
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("JSON 파싱 중 오류 발생:", error);
    throw new Error(`JSON 파싱 실패: ${(error as Error).message}`);
  }
}

export async function parseFileAsJson<T = any>(file: File): Promise<T> {
  try {
    const text = await file.text(); // File 객체의 text() 메서드 사용
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("JSON 파싱 중 오류 발생:", error);
    throw new Error(`JSON 파싱 실패: ${(error as Error).message}`);
  }
}

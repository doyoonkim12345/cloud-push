export function createJsonFile<T>(data: T, filename: string): File {
  // 객체를 JSON 문자열로 변환
  const jsonString = JSON.stringify(data, null, 2);

  // Blob 객체 생성 (JSON MIME 타입 지정)
  const blob = new Blob([jsonString], { type: "application/json" });

  // Blob을 이용해 File 객체 생성
  const file = new File([blob], filename, { type: "application/json" });

  return file;
}

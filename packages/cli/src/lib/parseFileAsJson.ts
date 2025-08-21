export function parseFileAsJson<T = any>(buffer: Uint8Array): T {
	try {
		const text = new TextDecoder().decode(buffer); // ✅ Uint8Array → string
		return JSON.parse(text) as T;
	} catch (error) {
		console.error("JSON 파싱 중 오류 발생:", error);
		throw new Error(`JSON 파싱 실패: ${(error as Error).message}`);
	}
}

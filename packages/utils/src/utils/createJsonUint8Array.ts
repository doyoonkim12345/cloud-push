export function createJsonUint8Array<T>(data: T): Uint8Array {
	// JSON 문자열로 변환
	const jsonString = JSON.stringify(data, null, 2);

	// 문자열을 Uint8Array로 변환
	const encoder = new TextEncoder();
	return encoder.encode(jsonString);
}

import type { Dictionary } from "structured-headers";

export const convertDictionaryToObject = <T extends {}>(
	dictionary: Dictionary,
): T => {
	// Map → 일반 JS Object로 변환
	const obj = Object.fromEntries(
		Array.from(dictionary.entries()).map(([key, item]) => {
			const value = item[0];

			if (value instanceof Uint8Array) {
				return [key, Buffer.from(value).toString("base64")];
			}

			return [key, value];
		}),
	);

	return obj as any;
};

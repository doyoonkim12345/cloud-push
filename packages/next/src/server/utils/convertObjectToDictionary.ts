import type { Dictionary } from "structured-headers";

export const convertObjectToDictionary = (obj: {
	[key: string]: string | number | boolean;
}): Dictionary => {
	return new Map(
		Object.entries(obj).map(([k, v]) => {
			let value: string | number | boolean;
			if (typeof v === "boolean") {
				value = !!v;
			} else if (typeof v === "number") {
				value = v;
			} else {
				value = v.toString();
			}
			return [k, [value, new Map()]];
		}),
	);
};

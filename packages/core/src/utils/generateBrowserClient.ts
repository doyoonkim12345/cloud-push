type NonFunction = string | number;
type Func = (...args: any[]) => any;
type Value = NonFunction | Func;

type AsyncReturn<T> = T extends (...args: any[]) => infer R
	? R extends Promise<infer P>
		? Promise<P>
		: Promise<R>
	: Promise<T>;

export function generateBrowserClient<T>(obj: T) {
	return async <K extends keyof T>(
		key: K,
		...args: T[K] extends (...args: infer P) => unknown ? P : []
	): Promise<AsyncReturn<T[K]>> => {
		const value = obj[key];

		if (typeof value === "function") {
			return (await (value as (...args: unknown[]) => unknown)(
				...args,
			)) as AsyncReturn<T[K]>;
		}
		return Promise.resolve(value as T[K]) as AsyncReturn<T[K]>;
	};
}

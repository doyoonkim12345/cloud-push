import { parseFileAsJson } from "@cloud-push/utils";
import { Low, Memory } from "lowdb";
import { JSONFile } from "lowdb/node";

export const LowDbLoader = {
	loadLowDb: async <T>(value?: T) => {
		const adapter = new Memory<T>();
		const db = new Low<T>(adapter, value ?? ({} as T));

		db.data = (value ?? {}) as T;

		return db;
	},

	loadLowDbFromFile: async <T>(file: Uint8Array, defaultValue?: T) => {
		const json = await parseFileAsJson<T>(file); // file: Uint8Array로 변경됨
		const db = await LowDbLoader.loadLowDb<T>(json);
		return db;
	},

	loadLowDbFromPath: async <T>(filePath: string, defaultValue?: T) => {
		const adapter = new JSONFile<T>(filePath);
		const db = new Low<T>(adapter, defaultValue ?? ({} as T));
		return db;
	},
};

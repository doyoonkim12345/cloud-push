import { storageBrowserClient } from "@/cloud-push.browser";
import { parseFileAsJson, type Setting } from "@cloud-push/core";

export const settingQueries = {
	all: {
		queryKey: ["setting"],
	},
	detail: () => ({
		queryKey: [...settingQueries.all.queryKey],
		queryFn: async (): Promise<Setting> => {
			try {
				const settingJson = await storageBrowserClient("getFile", {
					key: "setting.json",
				});
				return parseFileAsJson<Setting>(settingJson);
			} catch (e) {
				return { channels: [] };
			}
		},
	}),
};

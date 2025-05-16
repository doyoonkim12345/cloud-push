import { dbBrowserClient } from "@/cloud-push.browser";

export const versionsQueries = {
	all: { queryKey: ["versions"] },
	versions: (channel?: string) => ({
		queryKey: [...versionsQueries.all.queryKey, "versions", channel],
		queryFn: async () => {
			await dbBrowserClient("init");
			const bundles = await dbBrowserClient("findAll", {
				conditions: { channel },
				sortOptions: [{ direction: "desc", field: "createdAt" }],
			});

			return bundles;
		},
	}),
};

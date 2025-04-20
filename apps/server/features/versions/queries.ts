import type { Environment } from "@cloud-push/core";
import { dbBrowserClient } from "../api/browserClient";

const versionsQueries = {
	all: { queryKey: ["versions"] },
	versions: (environment?: Environment) => ({
		queryKey: [...versionsQueries.all.queryKey, "versions", environment],
		queryFn: async () => {
			await dbBrowserClient("init");
			const bundles = await dbBrowserClient("findAll", {
				conditions: { environment },
				sortOptions: [{ direction: "desc", field: "createdAt" }],
			});

			console.log("bundles", bundles);

			return bundles;
		},
	}),
};

export default versionsQueries;

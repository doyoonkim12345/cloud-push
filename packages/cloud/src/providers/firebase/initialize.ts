import {
	initializeApp,
	getApps,
	cert,
	type App,
	type ServiceAccount,
} from "firebase-admin/app";
import type { Agent } from "node:https";

let app: App | undefined;

export const initialize = (credential: string, httpAgent?: Agent): App => {
	if (!app) {
		if (getApps().length === 0) {
			const serviceAccount = JSON.parse(credential) as { private_key: string };

			app = initializeApp({
				credential: cert(
					{
						...serviceAccount,
						private_key: serviceAccount.private_key?.replace(/\\n/g, "\n"),
					} as ServiceAccount,
					httpAgent,
				),
			});
		} else {
			app = getApps()[0];
		}
	}

	return app;
};

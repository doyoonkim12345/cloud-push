import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { settingQueries } from "@/queries/settingQueries";
import { versionsQueries } from "@/queries/versionsQueries";
import { DashboardPageContent } from "@/components/DashboardPageContent";

export default async function Home(params: {
	searchParams: Promise<{ channel?: string; runtimeVersion?: string }>;
}) {
	const searchParams = await params.searchParams;
	const channel = searchParams.channel ?? "production";
	const runtimeVersion = searchParams.runtimeVersion;

	const queryClient = new QueryClient();

	const versionsQuery = versionsQueries.versions(channel);
	const settingQuery = settingQueries.detail();

	await Promise.all([
		queryClient.prefetchQuery({ ...versionsQuery }),
		queryClient.prefetchQuery({ ...settingQuery }),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<DashboardPageContent channel={channel} runtimeVersion={runtimeVersion} />
		</HydrationBoundary>
	);
}

import s3Queries from "@/features/versions/queries";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import HomePageContent from "./_components/HomePageContent";
import type { Environment } from "@cloud-push/core";

export default async function Home(params: {
	searchParams: Promise<{ environment?: Environment; runtimeVersion?: string }>;
}) {
	const searchParams = await params.searchParams;
	const environment = searchParams.environment ?? "production";
	const runtimeVersion = searchParams.runtimeVersion;

	const queryClient = new QueryClient();

	const query = s3Queries.versions(environment);

	await queryClient.prefetchQuery({ ...query });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<HomePageContent
				environment={environment}
				runtimeVersion={runtimeVersion}
			/>
		</HydrationBoundary>
	);
}

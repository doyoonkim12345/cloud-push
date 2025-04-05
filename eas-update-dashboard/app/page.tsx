import s3Queries from "@/features/s3/queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Suspense } from "react";
import HomePageContent from "./_components/HomePageContent";

export default async function Home() {
  const queryClient = new QueryClient();

  const query = s3Queries.versions();

  await queryClient.prefetchQuery({ ...query });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <HomePageContent />
      </Suspense>
    </HydrationBoundary>
  );
}

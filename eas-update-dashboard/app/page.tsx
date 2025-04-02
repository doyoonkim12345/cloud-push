"use client";

import { listFoldersWithPagination } from "@/features/api/client";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useInfiniteQuery({
    queryKey: ["list-bundles"],
    queryFn: ({ pageParam }: { pageParam?: string }) => {
      return listFoldersWithPagination({
        bucketName: "eas-update-bundles",
        prefix: "2.2.0/",
        continuationToken: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextContinuationToken;
    },
    initialPageParam: undefined,
  });

  const flatData = data?.pages.flatMap((e) => e.allFolders);

  return (
    <div className="w-full flex flex-col">
      {flatData?.map((e) => {
        return <span key={e}>{e}</span>;
      })}
    </div>
  );
}

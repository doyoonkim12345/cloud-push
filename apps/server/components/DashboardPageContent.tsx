"use client";

import { dbBrowserClient } from "@/cloud-push.browser";
import type { Bundle, UpdatePolicy } from "@cloud-push/cloud";
import { groupBy } from "@cloud-push/utils";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { rcompare } from "semver";
import { ChannelSelector } from "./ChannelSelector";
import { Header } from "./Header";
import { RuntimeVersionSelector } from "./RuntimeVersionSelector";
import { BundleCard } from "./BundleCard";
import { versionsQueries } from "@/queries/versionsQueries";
import { settingQueries } from "@/queries/settingQueries";

export function DashboardPageContent({
	channel,
	runtimeVersion,
}: {
	channel: string;
	runtimeVersion?: string;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: bundles } = useSuspenseQuery({
		...versionsQueries.versions(channel),
	});

	const { data: setting } = useSuspenseQuery({
		...settingQueries.detail(),
	});

	console.log(setting);

	const setChannel = (targetChannel: string) => {
		const newSearchParams = new URLSearchParams(window.location.search);
		newSearchParams.set("channel", targetChannel);
		newSearchParams.delete("runtimeVersion");
		router.replace(`?${newSearchParams.toString()}`, { scroll: false });
	};

	const setRuntimeVersion = (version: string) => {
		const newSearchParams = new URLSearchParams(window.location.search);
		newSearchParams.set("runtimeVersion", version);
		router.replace(`?${newSearchParams.toString()}`, { scroll: false });
	};

	const handleUpdatePolicyChange = async (
		bundle: Bundle,
		updatePolicy: UpdatePolicy,
	) => {
		await dbBrowserClient("update", { bundle: { ...bundle, updatePolicy } });
		await dbBrowserClient("sync");
		await queryClient.invalidateQueries({
			queryKey: versionsQueries.versions(channel).queryKey,
		});
	};

	const bundlesByRuntime = useMemo(
		() => groupBy(bundles, "runtimeVersion"),
		[bundles],
	);

	const runtimeVersions = useMemo(
		() => Object.keys(bundlesByRuntime).toSorted(rcompare),
		[bundlesByRuntime],
	);

	const targetRuntimeVersion: string | undefined =
		runtimeVersion ?? runtimeVersions[0];
	const targetBundles = bundlesByRuntime[targetRuntimeVersion];
	const androidUpdatableBundles =
		targetBundles?.filter((e) => e.supportAndroid) ?? [];
	const iosUpdatableBundles = targetBundles?.filter((e) => e.supportIos) ?? [];

	const androidLastestBundle = androidUpdatableBundles[0]
	const iosLatestBundle = iosUpdatableBundles[0]

	return (
		<div className="min-h-screen bg-gray-50 p-6 space-y-6">
			{/* 헤더 */}
			<Header />

			{/* 환경 선택기 */}
			<ChannelSelector
				selectedChannel={channel ?? null}
				onChange={setChannel}
				channels={setting.channels ?? []}
			/>

			{/* 런타임 버전 선택기 */}
			<RuntimeVersionSelector
				onChange={setRuntimeVersion}
				runtimeVersions={runtimeVersions}
				selectedRuntimeVersion={runtimeVersion}
			/>

			<div className="bg-white rounded-xl shadow p-6">
				<h2 className="text-lg font-semibold mb-4">Runtime Version Information</h2>
				<div className="flex w-full">
					<div className="flex flex-col flex-wrap gap-2 w-full">
						<h3 className="text-lg font-semibold">Android</h3>
						<div className="flex justify-between gap-2 w-full">
							<div>bundleId : {androidLastestBundle?.bundleId ?? 'embedded'}</div>
						</div>
						<h3 className="text-lg font-semibold">Ios</h3>
						<div className="flex justify-between gap-2 w-full">
							<div>bundleId : {iosLatestBundle?.bundleId ?? 'embedded'}</div>

						</div>
					</div>
				</div>
			</div>

			{/* 번들 리스트 */}
			<div className="space-y-4">
				{targetBundles?.map((bundle, index) => (
					<BundleCard
						key={bundle.bundleId}
						bundle={bundle}
						index={targetBundles.length - (index + 1)}
						androidLastestBundle={androidLastestBundle}
						iosLatestBundle={iosLatestBundle}
						gitRepositoryUrl={setting.repositoryUrl}
						enabled={bundle.enabled}
					/>
				))}
			</div>
		</div >
	);
}

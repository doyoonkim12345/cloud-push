"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { BranchSelector } from "./BranchSelector";
import { Header } from "./Header";
import type { ExpoBranch } from "@cloud-push/cloud";
import { UpdateGroupCard } from "./UpdateGroupCard";
import { RuntimeVersionSelector } from "./RuntimeVersionSelector";
import { branchQueries } from "../queries/branchQueries";
import { branchMetadataQueries } from "../queries/branchMetadataQueries";
import { runtimeVersionQueries } from "../queries/runtimeVersionQueries";
import "./components.css";
import { services } from "../services";

export function Dashboard() {
	const router = useRouter();

	const searchParams = useSearchParams();

	const branchId = searchParams.get("branchId")
	const runtimeVersion = searchParams.get("runtimeVersion")

	const { data: branches } = useQuery({
		...branchQueries.detail(),
	});

	const branch = branches?.find((branch) => branch.id === branchId)

	const setBranch = (targetBranch: ExpoBranch) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("branchId", targetBranch.id)
		router.replace(`?${newSearchParams.toString()}`, { scroll: false });
	};

	const setRuntimeVersion = (targetRuntimeVersion: string) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("runtimeVersion", targetRuntimeVersion)
		router.replace(`?${newSearchParams.toString()}`, { scroll: false });
	};

	const { data: branchMetadata } = useQuery({
		...branchMetadataQueries.metadata(branchId!),
		enabled: !!branchId
	})

	const { data: runtimeVersionMetadata } = useQuery({
		...runtimeVersionQueries.metadata(),
		enabled: !!branchId
	})

	const queryClient = useQueryClient()

	const handleForceUpdateRequiredClick = async (updateGroupId: string) => {
		if (!branchId) return

		await services.updateBranchMetadata(branchId, updateGroupId, {
			updateGroups: branchMetadata?.updateGroups.map((targetUpdateGroup) => {
				if (targetUpdateGroup.id === updateGroupId) {
					return {
						...targetUpdateGroup,
						isForceUpdateRequired: !targetUpdateGroup.isForceUpdateRequired
					}
				}
				return targetUpdateGroup
			}) ?? []
		})
		await queryClient.invalidateQueries({ queryKey: branchMetadataQueries.metadata(branchId).queryKey })
	}


	return (
		<div className="dashboard-container">
			<div className="dashboard-content">

				<Header />
				<BranchSelector
					selectedBranch={branch ?? null}
					onChange={setBranch}
					branches={branches ?? []}
				/>
				{branchId &&
					<RuntimeVersionSelector key={branchId} branchId={branchId} selectedRuntimeVersion={runtimeVersion} metadata={runtimeVersionMetadata ?? null} onChange={setRuntimeVersion} />
				}
				{branchMetadata?.updateGroups?.map((updateGroup, index) => (
					<UpdateGroupCard
						key={updateGroup.id}
						index={index}
						{...updateGroup}
						onForceUpdateRequiredClick={handleForceUpdateRequiredClick}
					/>
				))}
			</div>
		</div>
	);
}

"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { BranchSelector } from "./BranchSelector.js";
import { Header } from "./Header.js";
import { UpdateGroupCard } from "./UpdateGroupCard.js";
import { RuntimeVersionSelector } from "./RuntimeVersionSelector.js";
import { branchQueries } from "../queries/branchQueries.js";
import { branchMetadataQueries } from "../queries/branchMetadataQueries.js";
import { runtimeVersionQueries } from "../queries/runtimeVersionQueries.js";
import "./components.css";
import { services } from "../services.js";

;// CONCATENATED MODULE: external "react/jsx-runtime"

;// CONCATENATED MODULE: external "@tanstack/react-query"

;// CONCATENATED MODULE: external "next/navigation"

;// CONCATENATED MODULE: external "./BranchSelector.js"

;// CONCATENATED MODULE: external "./Header.js"

;// CONCATENATED MODULE: external "./UpdateGroupCard.js"

;// CONCATENATED MODULE: external "./RuntimeVersionSelector.js"

;// CONCATENATED MODULE: external "../queries/branchQueries.js"

;// CONCATENATED MODULE: external "../queries/branchMetadataQueries.js"

;// CONCATENATED MODULE: external "../queries/runtimeVersionQueries.js"

;// CONCATENATED MODULE: external "./components.css"

;// CONCATENATED MODULE: external "../services.js"

;// CONCATENATED MODULE: ./src/browser/components/Dashboard.tsx












function Dashboard() {
    var _branchMetadata_updateGroups;
    const router = useRouter();
    const searchParams = useSearchParams();
    const branchId = searchParams.get("branchId");
    const runtimeVersion = searchParams.get("runtimeVersion");
    const { data: branches } = useQuery({
        ...branchQueries.detail()
    });
    const branch = branches === null || branches === void 0 ? void 0 : branches.find((branch)=>branch.id === branchId);
    const setBranch = (targetBranch)=>{
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("branchId", targetBranch.id);
        router.replace(`?${newSearchParams.toString()}`, {
            scroll: false
        });
    };
    const setRuntimeVersion = (targetRuntimeVersion)=>{
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("runtimeVersion", targetRuntimeVersion);
        router.replace(`?${newSearchParams.toString()}`, {
            scroll: false
        });
    };
    const { data: branchMetadata } = useQuery({
        ...branchMetadataQueries.metadata(branchId),
        enabled: !!branchId
    });
    const { data: runtimeVersionMetadata } = useQuery({
        ...runtimeVersionQueries.metadata(),
        enabled: !!branchId
    });
    const queryClient = useQueryClient();
    const handleForceUpdateRequiredClick = async (updateGroupId)=>{
        if (!branchId) return;
        await services.updateBranchMetadata(branchId, updateGroupId, {
            updateGroups: (branchMetadata === null || branchMetadata === void 0 ? void 0 : branchMetadata.updateGroups.map((targetUpdateGroup)=>{
                if (targetUpdateGroup.id === updateGroupId) {
                    return {
                        ...targetUpdateGroup,
                        isForceUpdateRequired: !targetUpdateGroup.isForceUpdateRequired
                    };
                }
                return targetUpdateGroup;
            })) ?? []
        });
        await queryClient.invalidateQueries({
            queryKey: branchMetadataQueries.metadata(branchId).queryKey
        });
    };
    return /*#__PURE__*/ jsx("div", {
        className: "dashboard-container",
        children: /*#__PURE__*/ jsxs("div", {
            className: "dashboard-content",
            children: [
                /*#__PURE__*/ jsx(Header, {}),
                /*#__PURE__*/ jsx(BranchSelector, {
                    selectedBranch: branch ?? null,
                    onChange: setBranch,
                    branches: branches ?? []
                }),
                branchId && /*#__PURE__*/ jsx(RuntimeVersionSelector, {
                    branchId: branchId,
                    selectedRuntimeVersion: runtimeVersion,
                    metadata: runtimeVersionMetadata ?? null,
                    onChange: setRuntimeVersion
                }, branchId),
                branchMetadata === null || branchMetadata === void 0 ? void 0 : (_branchMetadata_updateGroups = branchMetadata.updateGroups) === null || _branchMetadata_updateGroups === void 0 ? void 0 : _branchMetadata_updateGroups.map((updateGroup, index)=>/*#__PURE__*/ jsx(UpdateGroupCard, {
                        index: index,
                        ...updateGroup,
                        onForceUpdateRequiredClick: handleForceUpdateRequiredClick
                    }, updateGroup.id))
            ]
        })
    });
}

export { Dashboard };

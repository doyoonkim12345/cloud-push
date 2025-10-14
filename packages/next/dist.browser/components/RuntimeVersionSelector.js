"use client"
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { runtimeVersionQueries } from "../queries/runtimeVersionQueries.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "../services.js";

;// CONCATENATED MODULE: external "react/jsx-runtime"

;// CONCATENATED MODULE: external "../queries/runtimeVersionQueries.js"

;// CONCATENATED MODULE: external "@tanstack/react-query"

;// CONCATENATED MODULE: external "../services.js"

;// CONCATENATED MODULE: ./src/browser/components/RuntimeVersionSelector.tsx




function RuntimeVersionSelector({ branchId, onChange, metadata, selectedRuntimeVersion }) {
    const { data: runtimeVersionUpdateStatus } = useQuery({
        ...runtimeVersionQueries.updateStatus(branchId),
        enabled: !!branchId
    });
    const runtimeVersions = (metadata === null || metadata === void 0 ? void 0 : metadata.runtimeVersions) ?? [];
    const queryClient = useQueryClient();
    const handleDeprecatedClick = async (runtimeVersion)=>{
        var _runtimeVersionUpdateStatus_runtimeVersion;
        if (!metadata) return;
        await services.updateRuntimeVersionUpdateStatus(branchId, {
            ...runtimeVersionUpdateStatus ?? {},
            [runtimeVersion]: {
                ...(runtimeVersionUpdateStatus === null || runtimeVersionUpdateStatus === void 0 ? void 0 : runtimeVersionUpdateStatus[runtimeVersion]) ?? {
                    isForceUpdateRequired: false
                },
                isDeprecated: !(runtimeVersionUpdateStatus === null || runtimeVersionUpdateStatus === void 0 ? void 0 : (_runtimeVersionUpdateStatus_runtimeVersion = runtimeVersionUpdateStatus[runtimeVersion]) === null || _runtimeVersionUpdateStatus_runtimeVersion === void 0 ? void 0 : _runtimeVersionUpdateStatus_runtimeVersion.isDeprecated)
            }
        });
        await queryClient.invalidateQueries({
            queryKey: runtimeVersionQueries.updateStatus(branchId).queryKey
        });
    };
    const handleForceUpdateRequiredClick = async (runtimeVersion)=>{
        // Force update is not available for runtime versions in the current type definition
        // This functionality is only available for update groups
        console.log('Force update not supported for runtime versions:', runtimeVersion);
    };
    const getVersionStats = ()=>{
        const total = runtimeVersions.length;
        const deprecated = runtimeVersions.filter((v)=>{
            var _runtimeVersionUpdateStatus_v;
            return runtimeVersionUpdateStatus === null || runtimeVersionUpdateStatus === void 0 ? void 0 : (_runtimeVersionUpdateStatus_v = runtimeVersionUpdateStatus[v]) === null || _runtimeVersionUpdateStatus_v === void 0 ? void 0 : _runtimeVersionUpdateStatus_v.isDeprecated;
        }).length;
        const active = total - deprecated;
        return {
            total,
            deprecated,
            active
        };
    };
    const stats = getVersionStats();
    return /*#__PURE__*/ jsxs("div", {
        className: "runtime-version-selector",
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "runtime-version-header",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "runtime-version-header-content",
                        children: [
                            /*#__PURE__*/ jsxs("h2", {
                                className: "runtime-version-title",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-title-icon",
                                        children: "⚙️"
                                    }),
                                    "Runtime Version Management"
                                ]
                            }),
                            /*#__PURE__*/ jsx("p", {
                                className: "runtime-version-subtitle",
                                children: "Manage deployment targets and version lifecycle"
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "runtime-version-stats",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                className: "runtime-version-stat-item",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-stat-value",
                                        children: stats.total
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-stat-label",
                                        children: "Total"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "runtime-version-stat-item runtime-version-stat-active",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-stat-value",
                                        children: stats.active
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-stat-label",
                                        children: "Active"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "runtime-version-stat-item runtime-version-stat-deprecated",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-stat-value",
                                        children: stats.deprecated
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-stat-label",
                                        children: "Deprecated"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            runtimeVersions.length === 0 ? /*#__PURE__*/ jsxs("div", {
                className: "runtime-version-empty",
                children: [
                    /*#__PURE__*/ jsx("div", {
                        className: "runtime-version-empty-icon",
                        children: "\uD83D\uDCE6"
                    }),
                    /*#__PURE__*/ jsx("h3", {
                        className: "runtime-version-empty-title",
                        children: "No Runtime Versions"
                    }),
                    /*#__PURE__*/ jsx("p", {
                        className: "runtime-version-empty-description",
                        children: "No runtime versions are available for this branch. Deploy your first version to get started."
                    })
                ]
            }) : /*#__PURE__*/ jsx("div", {
                className: "runtime-version-grid",
                children: runtimeVersions.map((runtimeVersion, index)=>/*#__PURE__*/ jsx(RuntimeVersionCard, {
                        runtimeVersion: runtimeVersion,
                        isSelected: runtimeVersion === selectedRuntimeVersion,
                        runtimeVersionUpdateStatus: runtimeVersionUpdateStatus ?? null,
                        onChange: onChange,
                        onDeprecatedClick: handleDeprecatedClick,
                        onForceUpdateClick: handleForceUpdateRequiredClick,
                        versionIndex: index,
                        totalVersions: runtimeVersions.length
                    }, runtimeVersion))
            })
        ]
    });
}
function RuntimeVersionCard({ runtimeVersion, isSelected, runtimeVersionUpdateStatus, onChange, onDeprecatedClick, onForceUpdateClick, versionIndex, totalVersions }) {
    var _runtimeVersionUpdateStatus_runtimeVersion;
    const isDeprecated = (runtimeVersionUpdateStatus === null || runtimeVersionUpdateStatus === void 0 ? void 0 : (_runtimeVersionUpdateStatus_runtimeVersion = runtimeVersionUpdateStatus[runtimeVersion]) === null || _runtimeVersionUpdateStatus_runtimeVersion === void 0 ? void 0 : _runtimeVersionUpdateStatus_runtimeVersion.isDeprecated) ?? false;
    const getVersionDisplayName = (version)=>{
        // Extract semantic version parts for better display
        const parts = version.split('.');
        if (parts.length >= 2) {
            return {
                major: parts[0],
                minor: parts[1],
                patch: parts[2] || '0',
                full: version
            };
        }
        return {
            major: version,
            minor: '',
            patch: '',
            full: version
        };
    };
    const versionInfo = getVersionDisplayName(runtimeVersion);
    return /*#__PURE__*/ jsxs("div", {
        className: `runtime-version-card-modern ${isSelected ? "selected" : ""} ${isDeprecated ? "deprecated" : ""}`,
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "runtime-version-card-header",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "runtime-version-card-index",
                        children: [
                            "#",
                            versionIndex + 1
                        ]
                    }),
                    isSelected && /*#__PURE__*/ jsxs("div", {
                        className: "runtime-version-selected-badge",
                        children: [
                            /*#__PURE__*/ jsx("span", {
                                className: "runtime-version-selected-icon",
                                children: "✓"
                            }),
                            "Selected"
                        ]
                    }),
                    isDeprecated && /*#__PURE__*/ jsxs("div", {
                        className: "runtime-version-deprecated-badge",
                        children: [
                            /*#__PURE__*/ jsx("span", {
                                className: "runtime-version-deprecated-icon",
                                children: "⚠️"
                            }),
                            "Deprecated"
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx("div", {
                className: "runtime-version-card-body",
                children: /*#__PURE__*/ jsx("button", {
                    type: "button",
                    onClick: ()=>onChange(runtimeVersion),
                    className: "runtime-version-card-button",
                    children: /*#__PURE__*/ jsxs("div", {
                        className: "runtime-version-display",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                className: "runtime-version-semantic",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-major",
                                        children: versionInfo.major
                                    }),
                                    versionInfo.minor && /*#__PURE__*/ jsxs(Fragment, {
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "runtime-version-dot",
                                                children: "."
                                            }),
                                            /*#__PURE__*/ jsx("span", {
                                                className: "runtime-version-minor",
                                                children: versionInfo.minor
                                            })
                                        ]
                                    }),
                                    versionInfo.patch && /*#__PURE__*/ jsxs(Fragment, {
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "runtime-version-dot",
                                                children: "."
                                            }),
                                            /*#__PURE__*/ jsx("span", {
                                                className: "runtime-version-patch",
                                                children: versionInfo.patch
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx("div", {
                                className: "runtime-version-full",
                                children: versionInfo.full
                            })
                        ]
                    })
                })
            }),
            /*#__PURE__*/ jsx("div", {
                className: "runtime-version-card-controls",
                children: /*#__PURE__*/ jsx("div", {
                    className: "runtime-version-control-group",
                    children: /*#__PURE__*/ jsxs("div", {
                        className: "runtime-version-control-item-modern",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                className: "runtime-version-control-info-modern",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "runtime-version-control-icon-modern",
                                        children: isDeprecated ? "🚫" : "✅"
                                    }),
                                    /*#__PURE__*/ jsxs("div", {
                                        className: "runtime-version-control-text-modern",
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "runtime-version-control-label",
                                                children: "Status"
                                            }),
                                            /*#__PURE__*/ jsx("span", {
                                                className: `runtime-version-control-value ${isDeprecated ? 'deprecated' : 'active'}`,
                                                children: isDeprecated ? "Deprecated" : "Active"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx("button", {
                                onClick: ()=>onDeprecatedClick(runtimeVersion),
                                type: "button",
                                className: `runtime-version-toggle-modern ${isDeprecated ? "on" : "off"}`,
                                "aria-label": `Toggle deprecated status for ${runtimeVersion}`,
                                children: /*#__PURE__*/ jsx("span", {
                                    className: "runtime-version-toggle-slider"
                                })
                            })
                        ]
                    })
                })
            })
        ]
    });
}

export { RuntimeVersionSelector };

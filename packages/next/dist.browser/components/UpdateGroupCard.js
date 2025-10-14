import { jsx, jsxs } from "react/jsx-runtime";

;// CONCATENATED MODULE: external "react/jsx-runtime"

;// CONCATENATED MODULE: ./src/browser/components/UpdateGroupCard.tsx

function UpdateGroupCard({ index, onForceUpdateRequiredClick, ...updateGroup }) {
    const formatDate = (date)=>{
        return new Date(date).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return /*#__PURE__*/ jsxs("div", {
        className: "update-group-card",
        children: [
            /*#__PURE__*/ jsxs("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                className: "update-group-header",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "update-group-title-container",
                        children: [
                            /*#__PURE__*/ jsxs("h3", {
                                className: "update-group-title",
                                children: [
                                    /*#__PURE__*/ jsxs("span", {
                                        className: "update-group-index",
                                        children: [
                                            "#",
                                            index + 1
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: "update-group-title-text",
                                        children: "Update Group"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsxs("p", {
                                className: "update-group-id",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "update-group-id-label",
                                        children: "ID:"
                                    }),
                                    /*#__PURE__*/ jsx("code", {
                                        className: "update-group-id-value",
                                        children: updateGroup.id
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsxs("button", {
                        style: {
                            flexShrink: 0
                        },
                        className: `update-group-force-button ${updateGroup.isForceUpdateRequired ? 'active' : 'inactive'}`,
                        onClick: ()=>onForceUpdateRequiredClick(updateGroup.id),
                        children: [
                            /*#__PURE__*/ jsx("span", {
                                className: "update-group-force-icon",
                                children: updateGroup.isForceUpdateRequired ? '🔴' : '⚪'
                            }),
                            "Enforce update using this bundle",
                            /*#__PURE__*/ jsx("span", {
                                className: "update-group-force-status",
                                children: updateGroup.isForceUpdateRequired ? 'ON' : 'OFF'
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsxs("div", {
                className: "update-group-details",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "update-group-info-grid",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                className: "update-group-info-item",
                                children: [
                                    /*#__PURE__*/ jsxs("span", {
                                        className: "update-group-info-label",
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "update-group-info-icon",
                                                children: "\uD83C\uDF0D"
                                            }),
                                            "Environment"
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: "update-group-info-value update-group-environment",
                                        children: updateGroup.environment
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "update-group-info-item",
                                children: [
                                    /*#__PURE__*/ jsxs("span", {
                                        className: "update-group-info-label",
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "update-group-info-icon",
                                                children: "\uD83D\uDCC5"
                                            }),
                                            "Created At"
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: "update-group-info-value",
                                        children: formatDate(updateGroup.createdAt)
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "update-group-info-item",
                                children: [
                                    /*#__PURE__*/ jsxs("span", {
                                        className: "update-group-info-label",
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "update-group-info-icon",
                                                children: "\uD83D\uDD27"
                                            }),
                                            "Runtime Version"
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: "update-group-info-value",
                                        children: /*#__PURE__*/ jsx("code", {
                                            children: updateGroup.runtimeVersion
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "update-group-info-item",
                                children: [
                                    /*#__PURE__*/ jsxs("span", {
                                        className: "update-group-info-label",
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "update-group-info-icon",
                                                children: "\uD83D\uDD17"
                                            }),
                                            "Git Hash"
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: "update-group-info-value",
                                        children: /*#__PURE__*/ jsx("code", {
                                            className: "update-group-git-hash",
                                            children: updateGroup.gitHash
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "update-group-info-item",
                                children: [
                                    /*#__PURE__*/ jsxs("span", {
                                        className: "update-group-info-label",
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "update-group-info-icon",
                                                children: "\uD83D\uDD10"
                                            }),
                                            "Code Signing"
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx("span", {
                                        className: `update-group-info-value update-group-status ${updateGroup.codeSigning ? 'enabled' : 'disabled'}`,
                                        children: updateGroup.codeSigning ? '✅ Enabled' : '❌ Disabled'
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsxs("div", {
                                className: "update-group-info-item",
                                children: [
                                    /*#__PURE__*/ jsxs("span", {
                                        className: "update-group-info-label",
                                        children: [
                                            /*#__PURE__*/ jsx("span", {
                                                className: "update-group-info-icon",
                                                children: "\uD83D\uDCF1"
                                            }),
                                            "Platform Support"
                                        ]
                                    }),
                                    /*#__PURE__*/ jsxs("span", {
                                        className: "update-group-info-value",
                                        children: [
                                            /*#__PURE__*/ jsxs("span", {
                                                className: `update-group-platform ${updateGroup.supportAndroid ? 'supported' : 'unsupported'}`,
                                                children: [
                                                    "Android ",
                                                    updateGroup.supportAndroid ? '✅' : '❌'
                                                ]
                                            }),
                                            ', ',
                                            /*#__PURE__*/ jsxs("span", {
                                                className: `update-group-platform ${updateGroup.supportIos ? 'supported' : 'unsupported'}`,
                                                children: [
                                                    "iOS ",
                                                    updateGroup.supportIos ? '✅' : '❌'
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    updateGroup.message && /*#__PURE__*/ jsxs("div", {
                        className: "update-group-message",
                        children: [
                            /*#__PURE__*/ jsxs("span", {
                                className: "update-group-message-label",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        className: "update-group-info-icon",
                                        children: "\uD83D\uDCAC"
                                    }),
                                    "Message"
                                ]
                            }),
                            /*#__PURE__*/ jsx("p", {
                                className: "update-group-message-content",
                                children: updateGroup.message
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

export { UpdateGroupCard };

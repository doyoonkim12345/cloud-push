import { jsx, jsxs } from "react/jsx-runtime";

;// CONCATENATED MODULE: external "react/jsx-runtime"

;// CONCATENATED MODULE: ./src/browser/components/BranchSelector.tsx

const BranchSelector = ({ selectedBranch, onChange, branches })=>{
    return /*#__PURE__*/ jsxs("div", {
        className: "branch-selector",
        children: [
            /*#__PURE__*/ jsx("h2", {
                className: "branch-selector-title",
                children: "Select Branch"
            }),
            /*#__PURE__*/ jsx("div", {
                className: "branch-selector-buttons",
                children: branches.map((branch)=>/*#__PURE__*/ jsx("div", {
                        children: /*#__PURE__*/ jsx("button", {
                            type: "button",
                            className: `branch-button ${(selectedBranch === null || selectedBranch === void 0 ? void 0 : selectedBranch.id) === branch.id ? "branch-button-selected" : "branch-button-default"}`,
                            onClick: ()=>onChange(branch),
                            children: branch.name
                        })
                    }, branch.id))
            })
        ]
    });
};

export { BranchSelector };

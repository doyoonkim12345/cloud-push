import type { ExpoBranch } from "@cloud-push/cloud";
interface BranchSelectorProps {
    selectedBranch: ExpoBranch | null;
    onChange: (selectedBranch: ExpoBranch) => void;
    branches: ExpoBranch[];
}
export declare const BranchSelector: React.FC<BranchSelectorProps>;
export {};
//# sourceMappingURL=BranchSelector.d.ts.map
import type { ExpoBranch } from "@cloud-push/cloud";

interface BranchSelectorProps {
    selectedBranch: ExpoBranch | null;
    onChange: (selectedBranch: ExpoBranch) => void;
    branches: ExpoBranch[];
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
    selectedBranch,
    onChange,
    branches,
}) => {
    return (
        <div className="branch-selector">
            <h2 className="branch-selector-title">Select Branch</h2>
            <div className="branch-selector-buttons">
                {branches.map((branch) => (
                    <div key={branch.id}>
                        <button
                            type="button"
                            className={`branch-button ${selectedBranch?.id === branch.id
                                ? "branch-button-selected"
                                : "branch-button-default"
                                }`}
                            onClick={() => onChange(branch)}
                        >
                            {branch.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

import type { RuntimeVersionMetadata } from "@cloud-push/cloud";
interface RuntimeVersionSelectorProps {
    selectedRuntimeVersion: string | null;
    onChange: (selectedRuntimeVersion: string) => void;
    metadata: RuntimeVersionMetadata | null;
    branchId: string;
}
export declare function RuntimeVersionSelector({ branchId, onChange, metadata, selectedRuntimeVersion, }: RuntimeVersionSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=RuntimeVersionSelector.d.ts.map
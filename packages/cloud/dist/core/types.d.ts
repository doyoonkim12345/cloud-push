import type { Environment } from "@cloud-push/core";
export type UpdatePolicy = "FORCE_UPDATE" | "NORMAL_UPDATE" | "ROLLBACK";
export type Cursor = {
    bundles: Bundle[];
};
export type Bundle = {
    bundleId: string;
    runtimeVersion: string;
    supportIos: boolean;
    supportAndroid: boolean;
    createdAt: number;
    environment: Environment;
    gitHash: string;
    updatePolicy: UpdatePolicy;
};
export interface FileInfo {
    path: string;
    relativePath: string;
}
export type FindCondition<T> = {
    [K in keyof T]?: T[K];
};
export type SortDirection = "asc" | "desc";
export type SortOption<T> = {
    field: keyof T;
    direction: SortDirection;
};
//# sourceMappingURL=types.d.ts.map
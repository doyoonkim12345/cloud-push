import { Environment, Platform } from "../../types";
import { SerializedVersionCursor, VersionCursor, VersionCursorData } from "./types";
export type FilterCriteria = {
    runtimeVersion?: string;
    platforms?: Platform[];
    requireAllPlatforms?: boolean;
    environment?: Environment;
    dateRange?: {
        from: number;
        to: number;
    };
};
export type SortOptions = {
    field: "createdAt" | "runtimeVersion";
    order: "asc" | "desc";
};
export declare class SearchResult {
    private data;
    constructor(data: VersionCursor);
    sort(options: SortOptions): Array<[string, VersionCursorData]>;
    getData(): VersionCursor;
    toArray(): Array<[string, VersionCursorData]>;
    [Symbol.iterator](): ArrayIterator<[string, VersionCursorData]>;
}
export default class VersionCursorStore {
    private data;
    private runtimeVersionIndex;
    private platformIndex;
    private createdAtIndex;
    private sortedCreatedAtValues;
    private environmentIndex;
    addVersion(bundleId: string, versionData: VersionCursorData): void;
    removeVersion(bundleId: string): boolean;
    private addToIndexes;
    private removeFromIndexes;
    find(criteria?: FilterCriteria): SearchResult;
    private updateResultSet;
    serialize(): SerializedVersionCursor;
    toJSON(): string;
    static deserialize(serialized: SerializedVersionCursor): VersionCursorStore;
    static fromJSON(file: File): Promise<VersionCursorStore>;
    loadFromSerialized(serialized: SerializedVersionCursor): void;
    loadFromJSON(file: File): Promise<void>;
}
//# sourceMappingURL=VersionCursorStore.d.ts.map
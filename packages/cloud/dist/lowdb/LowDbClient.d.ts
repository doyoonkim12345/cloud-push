import { DbClient } from "../core/DbClient";
import type { Bundle, FindCondition, SortOption } from "../core/types";
export declare class LowDbClient extends DbClient {
    private db;
    private downloadJSONFile;
    private uploadJSONFile;
    constructor({ downloadJSONFile, uploadJSONFile, }: {
        downloadJSONFile: () => Promise<Buffer>;
        uploadJSONFile: (file: Buffer) => Promise<void>;
    });
    create: ({ bundle }: {
        bundle: Bundle;
    }) => Promise<void>;
    readAll: () => Promise<Bundle[]>;
    find: ({ conditions, }: {
        conditions: FindCondition<Bundle>;
    }) => Promise<Bundle | null>;
    findAll: ({ conditions, sortOptions, }: {
        conditions: FindCondition<Bundle>;
        sortOptions?: SortOption<Bundle>[];
    }) => Promise<Bundle[]>;
    private sortBundles;
    private matchesConditions;
    update: ({ bundle }: {
        bundle: Bundle;
    }) => Promise<void>;
    delete: ({ bundleId }: {
        bundleId: string;
    }) => Promise<void>;
    toBuffer: () => Promise<Buffer>;
    init: () => Promise<void>;
    sync: () => Promise<void>;
}
//# sourceMappingURL=LowDbClient.d.ts.map
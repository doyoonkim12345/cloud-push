import type { Bundle, FindCondition, SortOption } from "../core/types";
import { DbClient } from "../core/DbClient";
import type { D1Database } from "@cloudflare/workers-types";
export declare class CloudflareD1DbClient extends DbClient {
    private db;
    private tableName;
    constructor(env: {
        DB: D1Database;
    }, tableName?: string);
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
//# sourceMappingURL=CloudflareD1DbClient.d.ts.map
import type { Bundle, FindCondition, SortOption } from "../core/types";
import { DbClient } from "../core/DbClient";
export declare class SupabaseDbClient extends DbClient {
    private client;
    private tableName;
    constructor({ supabaseUrl, supabaseKey, tableName, }: {
        supabaseUrl: string;
        supabaseKey: string;
        tableName?: string;
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
//# sourceMappingURL=SupabaseDbClient.d.ts.map
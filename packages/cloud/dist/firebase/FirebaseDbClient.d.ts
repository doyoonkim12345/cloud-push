import type { Bundle, FindCondition, SortOption } from "../core/types";
import { DbClient } from "../core/DbClient";
import type { Agent } from "node:https";
interface FirebaseDbClientProps {
    credential: string;
    databaseId: string;
    httpAgent?: Agent;
    tableName?: string;
}
export declare class FirebaseDbClient extends DbClient {
    private db;
    private collectionName;
    constructor({ credential, httpAgent, tableName, databaseId, }: FirebaseDbClientProps);
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
export {};
//# sourceMappingURL=FirebaseDbClient.d.ts.map
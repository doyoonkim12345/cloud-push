import type { Bundle, FindCondition, SortOption } from "@/types";

export abstract class DbClient {
	abstract create: (params: { bundle: Bundle }) => Promise<void>;
	abstract find: (params: {
		conditions: FindCondition<Bundle>;
	}) => Promise<Bundle | null>;
	abstract findAll: (params: {
		conditions: FindCondition<Bundle>;
		sortOptions?: SortOption<Bundle>[];
	}) => Promise<Bundle[]>;
	abstract readAll: () => Promise<Bundle[]>;
	abstract update: (params: { bundle: Bundle }) => Promise<void>;
	abstract delete: (params: { bundleId: string }) => Promise<void>;
	abstract toUint8Array: () => Promise<Uint8Array>;
	abstract init?(): Promise<void>;
	abstract sync?(): Promise<void>;
}

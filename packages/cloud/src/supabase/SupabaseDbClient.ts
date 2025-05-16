import {
	createClient,
	type SupabaseClient as OriginalSupabaseClient,
} from "@supabase/supabase-js";
import type { Bundle, FindCondition, SortOption } from "@/core/types";
import { DbClient } from "@/core/DbClient";

export class SupabaseDbClient extends DbClient {
	private client: OriginalSupabaseClient;
	private tableName: string;

	constructor({
		supabaseUrl,
		supabaseKey,
		tableName = "bundles",
	}: {
		supabaseUrl: string;
		supabaseKey: string;
		tableName?: string;
	}) {
		super();
		this.client = createClient(supabaseUrl, supabaseKey);
		this.tableName = tableName;
	}

	create = async ({ bundle }: { bundle: Bundle }): Promise<void> => {
		const { error } = await this.client.from(this.tableName).insert(bundle);

		if (error) {
			throw new Error(`Failed to create bundle: ${error.message}`);
		}
	};

	readAll = async (): Promise<Bundle[]> => {
		const { data, error } = await this.client.from(this.tableName).select("*");

		if (error) {
			throw new Error(`Failed to read bundles: ${error.message}`);
		}

		return data as Bundle[];
	};

	// 여러 조건으로 단일 Bundle 검색
	find = async ({
		conditions,
	}: {
		conditions: FindCondition<Bundle>;
	}): Promise<Bundle | null> => {
		let query = this.client.from(this.tableName).select("*");

		for (const [key, value] of Object.entries(conditions)) {
			query = query.eq(key, value);
		}

		const { data, error } = await query.limit(1).single();

		if (error && error.code !== "PGRST116") {
			// PGRST116은 "결과 없음" 에러
			throw new Error(`Failed to find bundle: ${error.message}`);
		}

		return data as Bundle | null;
	};

	// 여러 조건으로 여러 Bundle 검색 (선택적 정렬 지원)
	findAll = async ({
		conditions,
		sortOptions = [],
	}: {
		conditions: FindCondition<Bundle>;
		sortOptions?: SortOption<Bundle>[];
	}): Promise<Bundle[]> => {
		let query = this.client.from(this.tableName).select("*");

		// 조건 적용
		for (const [key, value] of Object.entries(conditions)) {
			if (typeof value !== "undefined") {
				query = query.eq(key, value);
			}
		}

		// 정렬 옵션 적용 (있을 경우)
		for (const option of sortOptions) {
			const { field, direction } = option;
			query = query.order(field as string, { ascending: direction === "asc" });
		}

		const { data, error } = await query;

		if (error) {
			throw new Error(`Failed to find bundles: ${error.message}`);
		}

		return data as Bundle[];
	};

	update = async ({ bundle }: { bundle: Bundle }): Promise<void> => {
		console.log("Updating bundle", bundle.bundleId);

		const { error } = await this.client
			.from(this.tableName)
			.update(bundle)
			.eq("bundleId", bundle.bundleId);

		if (error) {
			throw new Error(`Failed to update bundle: ${error.message}`);
		}
	};

	delete = async ({ bundleId }: { bundleId: string }): Promise<void> => {
		console.log("Deleting bundle", bundleId);

		const { error } = await this.client
			.from(this.tableName)
			.delete()
			.eq("bundleId", bundleId);

		if (error) {
			throw new Error(`Failed to delete bundle: ${error.message}`);
		}
	};

	toUint8Array = async (): Promise<Uint8Array> => {
		const bundles = await this.readAll();
		const jsonString = JSON.stringify({ bundles });
		return new TextEncoder().encode(jsonString); // ✅ Uint8Array 반환
	};

	init = async (): Promise<void> => {
		console.log("Initialized Supabase client");
	};

	sync = async (): Promise<void> => {
		console.log("Supabase is always in sync");
	};
}

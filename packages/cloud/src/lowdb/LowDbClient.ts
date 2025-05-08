import { DbClient } from "@/core/DbClient";
import type { Bundle, Cursor, FindCondition, SortOption } from "@/core/types";
import { Low, Memory } from "lowdb";
import { LowDbLoader } from "./LowDbLoader";

export class LowDbClient extends DbClient {
	private db: Low<Cursor> | null;

	private downloadJSONFile: () => Promise<Uint8Array>;
	private uploadJSONFile: (file: Uint8Array) => Promise<void>;

	constructor({
		downloadJSONFile,
		uploadJSONFile,
	}: {
		downloadJSONFile: () => Promise<Uint8Array>;
		uploadJSONFile: (file: Uint8Array) => Promise<void>;
	}) {
		super();
		this.downloadJSONFile = downloadJSONFile;
		this.uploadJSONFile = uploadJSONFile;
		this.db = null;
	}

	create = async ({ bundle }: { bundle: Bundle }): Promise<void> => {
		await this.db?.update(({ bundles }) => bundles.push(bundle));
	};

	readAll = async (): Promise<Bundle[]> => {
		return this.db?.data.bundles ?? [];
	};

	// 여러 조건으로 단일 Bundle 검색
	find = async ({
		conditions,
	}: {
		conditions: FindCondition<Bundle>;
	}): Promise<Bundle | null> => {
		const bundle = this.db?.data.bundles.find((bundle) =>
			this.matchesConditions(bundle, conditions),
		);
		return bundle || null;
	};

	// 여러 조건으로 모든 Bundle 검색 (선택적 정렬 지원)
	findAll = async ({
		conditions,
		sortOptions = [],
	}: {
		conditions: FindCondition<Bundle>;
		sortOptions?: SortOption<Bundle>[];
	}): Promise<Bundle[]> => {
		// 조건에 맞는 번들 필터링
		const filteredBundles =
			this.db?.data.bundles.filter((bundle) =>
				this.matchesConditions(bundle, conditions),
			) ?? [];

		// 정렬 옵션이 있으면 정렬 수행
		if (sortOptions.length > 0) {
			return this.sortBundles(filteredBundles, sortOptions);
		}

		return filteredBundles;
	};

	// 번들 배열 정렬 (여러 필드 지원)
	private sortBundles(
		bundles: Bundle[],
		sortOptions: SortOption<Bundle>[],
	): Bundle[] {
		if (sortOptions.length === 0) return bundles;

		return [...bundles].sort((a, b) => {
			for (const option of sortOptions) {
				const { field, direction } = option;
				const aValue = a[field];
				const bValue = b[field];

				// 값 비교
				if (aValue < bValue) {
					return direction === "asc" ? -1 : 1;
				}
				if (aValue > bValue) {
					return direction === "asc" ? 1 : -1;
				}
				// 값이 같으면 다음 정렬 기준으로 넘어감
			}

			// 모든 정렬 기준이 같으면 0 반환
			return 0;
		});
	}

	// 모든 조건에 맞는지 확인하는 헬퍼 함수
	private matchesConditions(
		bundle: Bundle,
		conditions: FindCondition<Bundle>,
	): boolean {
		return Object.entries(conditions).every(([key, value]) => {
			if (typeof value === "undefined") {
				return true;
			}
			return bundle[key as keyof Bundle] === value;
		});
	}

	update = async ({ bundle }: { bundle: Bundle }): Promise<void> => {
		console.log("Updating bundle", bundle.bundleId);

		await this.db?.update(({ bundles }) => {
			const index = bundles.findIndex((e) => e.bundleId === bundle.bundleId);

			console.log(index, bundles[index]);

			if (index !== -1) {
				// Replace the existing bundle with the updated one
				bundles[index] = bundle;
				console.log(bundles);
				return true;
			}
			return false;
		});
	};

	delete = async ({ bundleId }: { bundleId: string }): Promise<void> => {
		console.log("Deleting bundle", bundleId);

		await this.db?.update(({ bundles }) => {
			const filtered = bundles.filter((bundle) => bundle.bundleId !== bundleId);
			bundles.length = 0; // Clear the array
			bundles.push(...filtered); // Refill with filtered items
		});
	};

	toUint8Array = async (): Promise<Uint8Array> => {
		const jsonString = JSON.stringify(this.db?.data);
		return new TextEncoder().encode(jsonString); // ✅ Uint8Array로 변환
	};

	init = async (): Promise<void> => {
		try {
			const file = await this.downloadJSONFile();
			const db = await LowDbLoader.loadLowDbFromFile<Cursor>(file);
			this.db = db;
		} catch (e) {
			const adapter = new Memory<Cursor>();
			const db = new Low(adapter, { bundles: [] });
			this.db = db;
		}
	};

	sync = async (): Promise<void> => {
		const file = await this.toUint8Array();
		await this.uploadJSONFile(file);
	};
}

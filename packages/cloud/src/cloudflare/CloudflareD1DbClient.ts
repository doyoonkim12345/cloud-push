import type { Bundle, FindCondition, SortOption } from "@/core/types";
import { DbClient } from "@/core/DbClient";
import type { D1Database } from "@cloudflare/workers-types";

export class CloudflareD1DbClient extends DbClient {
	private db: D1Database;
	private tableName: string;

	constructor(env: { DB: D1Database }, tableName = "bundles") {
		super();
		this.db = env.DB;
		this.tableName = tableName;
	}

	create = async ({ bundle }: { bundle: Bundle }): Promise<void> => {
		const keys = Object.keys(bundle);
		const values = Object.values(bundle);

		const placeholders = keys.map(() => "?").join(", ");
		const sql = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders})`;

		const result = await this.db
			.prepare(sql)
			.bind(...values)
			.run();
		if (!result.success) throw new Error("Failed to insert bundle");
	};

	readAll = async (): Promise<Bundle[]> => {
		const sql = `SELECT * FROM ${this.tableName}`;
		const { results } = await this.db.prepare(sql).all();
		return results as Bundle[];
	};

	find = async ({
		conditions,
	}: {
		conditions: FindCondition<Bundle>;
	}): Promise<Bundle | null> => {
		const clauses = Object.entries(conditions)
			.map(([key]) => `${key} = ?`)
			.join(" AND ");
		const values = Object.values(conditions);

		const sql = `SELECT * FROM ${this.tableName} WHERE ${clauses} LIMIT 1`;
		const result = await this.db
			.prepare(sql)
			.bind(...values)
			.first();
		return result as Bundle | null;
	};

	findAll = async ({
		conditions,
		sortOptions = [],
	}: {
		conditions: FindCondition<Bundle>;
		sortOptions?: SortOption<Bundle>[];
	}): Promise<Bundle[]> => {
		const clauses = Object.entries(conditions)
			.map(([key]) => `${key} = ?`)
			.join(" AND ");
		const values = Object.values(conditions);

		const orderClause = sortOptions
			.map(({ field, direction }) => `${field} ${direction.toUpperCase()}`)
			.join(", ");

		const sql = `SELECT * FROM ${this.tableName} WHERE ${clauses}${
			orderClause ? ` ORDER BY ${orderClause}` : ""
		}`;

		const { results } = await this.db
			.prepare(sql)
			.bind(...values)
			.all();
		return results as Bundle[];
	};

	update = async ({ bundle }: { bundle: Bundle }): Promise<void> => {
		const { bundleId, ...rest } = bundle;
		const updates = Object.keys(rest)
			.map((key) => `${key} = ?`)
			.join(", ");
		const values = Object.values(rest);

		const sql = `UPDATE ${this.tableName} SET ${updates} WHERE bundleId = ?`;
		const result = await this.db
			.prepare(sql)
			.bind(...values, bundleId)
			.run();
		if (!result.success) throw new Error("Failed to update bundle");
	};

	delete = async ({ bundleId }: { bundleId: string }): Promise<void> => {
		const sql = `DELETE FROM ${this.tableName} WHERE bundleId = ?`;
		const result = await this.db.prepare(sql).bind(bundleId).run();
		if (!result.success) throw new Error("Failed to delete bundle");
	};

	toBuffer = async (): Promise<Buffer> => {
		const bundles = await this.readAll();
		const jsonString = JSON.stringify({ bundles });
		return Buffer.from(jsonString, "utf-8");
	};

	init = async (): Promise<void> => {
		console.log("Initialized D1 client");
	};

	sync = async (): Promise<void> => {
		console.log("D1 is always in sync");
	};
}

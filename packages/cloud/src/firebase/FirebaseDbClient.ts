import { type Firestore, getFirestore } from "firebase-admin/firestore";
import type { Bundle, FindCondition, SortOption } from "@/core/types";
import { DbClient } from "@/core/DbClient";
import { initialize } from "./initialize";
import type { Agent } from "node:https";

interface FirebaseDbClientProps {
	credential: string;
	databaseId: string;
	httpAgent?: Agent;
	tableName?: string;
}

export class FirebaseDbClient extends DbClient {
	private db: Firestore;
	private collectionName: string;

	constructor({
		credential,
		httpAgent,
		tableName = "bundles",
		databaseId,
	}: FirebaseDbClientProps) {
		super();
		const app = initialize(credential, httpAgent);
		this.db = getFirestore(app, databaseId);
		this.collectionName = tableName;
	}

	create = async ({ bundle }: { bundle: Bundle }): Promise<void> => {
		await this.db
			.collection(this.collectionName)
			.doc(bundle.bundleId)
			.set(bundle, { merge: true });
	};

	readAll = async (): Promise<Bundle[]> => {
		const snapshot = await this.db.collection(this.collectionName).get();
		return snapshot.docs.map((doc) => doc.data() as Bundle);
	};

	find = async ({
		conditions,
	}: {
		conditions: FindCondition<Bundle>;
	}): Promise<Bundle | null> => {
		let query: FirebaseFirestore.Query = this.db.collection(
			this.collectionName,
		);
		for (const [key, value] of Object.entries(conditions)) {
			query = query.where(key, "==", value);
		}

		const snapshot = await query.limit(1).get();
		if (snapshot.empty) return null;

		return snapshot.docs[0].data() as Bundle;
	};

	findAll = async ({
		conditions,
		sortOptions = [],
	}: {
		conditions: FindCondition<Bundle>;
		sortOptions?: SortOption<Bundle>[];
	}): Promise<Bundle[]> => {
		let query: FirebaseFirestore.Query = this.db.collection(
			this.collectionName,
		);
		for (const [key, value] of Object.entries(conditions)) {
			if (value !== undefined) {
				query = query.where(key, "==", value);
			}
		}

		for (const { field, direction } of sortOptions) {
			query = query.orderBy(field as string, direction);
		}

		const snapshot = await query.get();
		return snapshot.docs.map((doc) => doc.data() as Bundle);
	};

	update = async ({ bundle }: { bundle: Bundle }): Promise<void> => {
		await this.db
			.collection(this.collectionName)
			.doc(bundle.bundleId)
			.update(bundle);
	};

	delete = async ({ bundleId }: { bundleId: string }): Promise<void> => {
		await this.db.collection(this.collectionName).doc(bundleId).delete();
	};

	toBuffer = async (): Promise<Buffer> => {
		const bundles = await this.readAll();
		const jsonString = JSON.stringify({ bundles });
		return Buffer.from(jsonString, "utf-8");
	};

	init = async (): Promise<void> => {
		console.log("Initialized Firebase client");
	};

	sync = async (): Promise<void> => {
		console.log("Firestore is always in sync");
	};
}

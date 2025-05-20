export type UpdatePolicy = "FORCE_UPDATE" | "NORMAL_UPDATE" | "ROLLBACK";

export type Cursor = {
	bundles: Bundle[];
};

export type Bundle = {
	bundleId: string;
	runtimeVersion: string;
	supportIos: boolean;
	supportAndroid: boolean;
	createdAt: number;
	environment: Environment;
	channel: string;
	gitHash: string;
	updatePolicy: UpdatePolicy;
	codeSigning?: boolean;
};

// File information interface definition
export interface FileInfo {
	path: string;
	relativePath: string;
}

export type FindCondition<T> = {
	[K in keyof T]?: T[K];
};

// 정렬 옵션 타입 정의
export type SortDirection = "asc" | "desc";

export type SortOption<T> = {
	field: keyof T;
	direction: SortDirection;
};

export type Storage = "AWS_S3" | "FIREBASE" | "SUPABASE" | "CUSTOM";

export type Db = "LOWDB" | "FIREBASE" | "SUPABASE" | "CUSTOM";

export type Platform = "android" | "ios";

export type Environment = "production" | "development" | "preview";

export interface Setting {
	repositoryUrl?: string;
	channels: string[];
}

export interface UpdateStatus {
	isForceUpdateRequired: boolean;
}

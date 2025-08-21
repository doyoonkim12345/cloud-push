
// File information interface definition
export interface FileInfo {
	path: string;
	relativePath: string;
}

export type Storage = "AWS_S3" | "FIREBASE" | "SUPABASE" | "CUSTOM";

export type Db = "LOWDB" | "FIREBASE" | "SUPABASE" | "CUSTOM";

export type Platform = "android" | "ios";

export type Environment = "production" | "development" | "preview";


export interface UpdateStatus {
	isForceUpdateRequired: boolean;
	isDeprecated: boolean;
}
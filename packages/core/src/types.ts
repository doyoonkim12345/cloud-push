export type Platform = "android" | "ios";

export type Environment = "production" | "development" | "preview";

export type Storage = "AWS_S3" | "FIREBASE" | "SUPABASE" | "CUSTOM";
export type Db = "LOWDB" | "FIREBASE" | "SUPABASE" | "CUSTOM";

export interface Setting {
	repositoryUrl: string;
	channels: string[];
}

import { type Environment } from "@cloud-push/core";
type S3_KEY = "AWS_BUCKET_NAME" | "AWS_REGION" | "AWS_SECRET_ACCESS_KEY" | "AWS_ACCESS_KEY_ID";
export default function loadEASEnv<T extends S3_KEY>(environment: Environment, keys: T[]): Promise<{
    [key in T]: string;
}>;
export {};
//# sourceMappingURL=loadEnv.d.ts.map
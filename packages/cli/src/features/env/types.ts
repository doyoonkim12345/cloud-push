type S3_KEY =
  | "AWS_BUCKET_NAME"
  | "AWS_REGION"
  | "AWS_SECRET_ACCESS_KEY"
  | "AWS_ACCESS_KEY_ID";

export type ENV_KEY = S3_KEY;

export type ENV_SOURCE = "eas" | "file";

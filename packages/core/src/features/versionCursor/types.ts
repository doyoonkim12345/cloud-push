import { Environment, Platform } from "@/types";

export type VersionCursorData = {
  runtimeVersion: string;
  platforms: Platform[];
  createdAt: number;
  environment: Environment;
  gitHash: string;
};

export type VersionCursor = {
  [bundleId: string]: VersionCursorData;
};

export interface SerializedVersionCursor {
  data: VersionCursor;
  runtimeVersionIndex: (string | string[])[][];
  platformIndex: (Platform | string[])[][];
  createdAtIndex: (number | string[])[][];
  sortedCreatedAtValues: number[];
  environmentIndex: (Environment | string[])[][];
}

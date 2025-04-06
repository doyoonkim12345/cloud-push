import { Storage } from "@/types";
import { ENV_SOURCE } from "./features/env/types";

export type Config = {
  storage: Storage;
  runtimeVersion?: string;
  envSource: ENV_SOURCE;
};

export const defineConfig = async (config: Config) => {
  return config;
};

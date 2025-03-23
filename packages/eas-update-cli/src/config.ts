import { Storage } from "@/types";

export type Config = {
  storage: Storage;
  runtimeVersion?: string;
};

export const defineConfig = async (config: Config) => {
  return config;
};

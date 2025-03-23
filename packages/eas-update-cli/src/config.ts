import { Storage } from "@/types";

export type Config = {
  storage: Storage;
};

export const defineConfig = async (config: Config) => {
  return config;
};

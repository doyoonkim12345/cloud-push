import { defineConfig } from "eas-update";

export const version = {
  runtimeVersion: "10.0.1",
};

const config = defineConfig({
  storage: "AWS_S3",
  runtimeVersion: version.runtimeVersion,
});

export default config;

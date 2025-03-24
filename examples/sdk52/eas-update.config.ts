import { defineConfig } from "eas-update-cli";

export const version = {
  runtimeVersion: "1.0.2",
};

const config = defineConfig({
  storage: "AWS_S3",
  runtimeVersion: version.runtimeVersion,
});

export default config;

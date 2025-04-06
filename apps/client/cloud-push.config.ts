import { defineConfig } from "@cloud-push/cli";
import version from "./version";

const config = defineConfig({
  storage: "AWS_S3",
  runtimeVersion: version.runtimeVersion,
  envSource: "file",
});

export default config;

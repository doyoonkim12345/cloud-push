import { defineConfig } from "eas-update-cli";
import version from "./version";

const config = defineConfig({
  storage: "AWS_S3",
  runtimeVersion: version.VERSION,
});

export default config;

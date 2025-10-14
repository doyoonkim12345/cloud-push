import { defineConfig } from "@cloud-push/next";

export default defineConfig(() => ({
    codeSigningPrivateKey: process.env.CLOUD_PUSH_PRIVATE_KEY,
}));
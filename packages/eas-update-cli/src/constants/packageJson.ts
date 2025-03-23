import { readPackageUpSync } from "read-package-up";

export const { packageJson } =
  readPackageUpSync({
    cwd: process.cwd(),
  }) ?? {};

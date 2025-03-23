import * as semver from "semver";
import { packageJson } from "@/constants/packageJson";

export default function checkPackageAvailable(
  packageName: string,
  satisfiesVersion: string
) {
  // 패키지 불러오기

  const packageVersion = packageJson?.dependencies?.[packageName]?.replace(
    /[\^~]/g,
    ""
  );
  const isPackageInstalled = !!packageVersion;

  if (!isPackageInstalled) {
    throw new Error(`${packageName} is not installed`);
  }

  const isSatisfiedVersion =
    typeof packageVersion !== "undefined" &&
    semver.satisfies(packageVersion, satisfiesVersion);

  if (!isSatisfiedVersion) {
    throw new Error(`This package requires version ${satisfiesVersion}`);
  }
}

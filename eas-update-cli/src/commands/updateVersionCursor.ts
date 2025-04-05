import { Environment, Platform } from "eas-update-core";
import { VersionCursor } from "eas-update-core/version-cursor";

export function updateVersionCursor(
  currentVersionCursor: VersionCursor,
  {
    runtimeVersion,
    environment,
    bundleId,
    platforms,
  }: {
    runtimeVersion: string;
    environment: Environment;
    bundleId: string;
    platforms: Platform[];
  }
): VersionCursor {
  const existingCursor = currentVersionCursor;

  const updatedEnvironment = {
    ...currentVersionCursor[environment],
    [runtimeVersion]: {
      ...existingCursor,
      bundleId,
      platforms,
    },
  };

  return {
    ...currentVersionCursor,
    [environment]: updatedEnvironment,
  };
}

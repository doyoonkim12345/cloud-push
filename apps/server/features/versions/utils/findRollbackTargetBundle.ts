import { Bundle } from "@cloud-push/cloud";

export const findRollbackTargetBundle = (
  currentBundles: Bundle[],
  rollbackBundleId: string
): Bundle | undefined => {
  const startIndex = currentBundles.findIndex(
    (e) => e.bundleId === rollbackBundleId
  );
  const previousBundles =
    startIndex !== -1 ? currentBundles.slice(startIndex) : [];

  const updatableBundles = previousBundles.filter(
    (e) => e.updatePolicy === "NORMAL_UPDATE"
  );

  return updatableBundles[0];
};

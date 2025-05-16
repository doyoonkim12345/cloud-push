import type { Bundle } from "@cloud-push/cloud";

/**
 * @returns {Bundle | undefined} undefined가 return 되면 embedded 번들을 사용합니다.
 */
export const findRollbackTargetBundle = (
	currentBundles: Bundle[],
	rollbackBundleId: string,
): Bundle | undefined => {
	const startIndex = currentBundles.findIndex(
		(e) => e.bundleId === rollbackBundleId,
	);
	const previousBundles =
		startIndex !== -1 ? currentBundles.slice(startIndex) : [];

	const updatableBundles = previousBundles.filter(
		(e) => e.updatePolicy === "NORMAL_UPDATE",
	);

	return updatableBundles[0];
};

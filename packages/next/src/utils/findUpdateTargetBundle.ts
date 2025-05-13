import type { Bundle } from "@cloud-push/cloud";

/**
 * 두 숫자를 더합니다.
 * @returns {Bundle | undefined} undefined가 return 되면 embedded 번들을 사용합니다.
 */
export const findUpdateTargetBundle = (
	currentBundles: Bundle[],
	updateBundleId: string,
): Bundle | undefined => {
	const endIndex = currentBundles.findIndex(
		(e) => e.bundleId === updateBundleId,
	);
	const nextBundles = endIndex !== -1 ? currentBundles.slice(0, endIndex) : [];
	const updatableBundles = nextBundles.filter(
		(e) => e.updatePolicy === "NORMAL_UPDATE",
	);

	return updatableBundles[0];
};

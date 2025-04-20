import type { Bundle } from "@cloud-push/cloud";

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

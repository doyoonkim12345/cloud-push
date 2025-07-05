import type { Bundle, UpdatePolicy } from "@cloud-push/cloud";
import { getCommitUrl } from "@cloud-push/utils";

export function BundleCard({
	bundle,
	index,
	androidLastestBundle,
	iosLatestBundle,
	gitRepositoryUrl,
	enabled,
	onEnabledChange
}: {
	bundle: Bundle;
	index: number;
	androidLastestBundle?: Bundle;
	iosLatestBundle?: Bundle;
	gitRepositoryUrl?: string;
	enabled: boolean;
	onEnabledChange: (enabled: boolean) => void;
}) {
	const isAndroidLatestBundle =
		androidLastestBundle?.bundleId === bundle.bundleId;
	const isIosLatestBundle = iosLatestBundle?.bundleId === bundle.bundleId;

	return (
		<div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition w-full max-w-full">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
				<div className="flex-1">
					<h3 className="font-semibold text-gray-800 flex flex-wrap items-center gap-2 text-base sm:text-lg">
						<span className="text-blue-600">#{index + 1}</span> Bundle ID
						<div className="flex flex-wrap gap-1">
							{isAndroidLatestBundle && (
								<span className="px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded">
									Android Latest
								</span>
							)}
							{isIosLatestBundle && (
								<span className="px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded">
									iOS Latest
								</span>
							)}
						</div>
					</h3>
					<p className="text-sm break-all text-gray-600 mt-1">
						{bundle.bundleId}
					</p>
				</div>
			</div>

			<div className="text-sm text-gray-700 space-y-1">
				<p>
					<strong>Platforms:</strong> Android:{" "}
					{bundle.supportAndroid ? "✅" : "❌"}, iOS:{" "}
					{bundle.supportIos ? "✅" : "❌"}
				</p>
				<p>
					<strong>Created At:</strong>{" "}
					{new Date(bundle.createdAt).toLocaleString()}
				</p>
				<p>
					<strong>Environment:</strong> {bundle.environment}
				</p>
				<a
					href={
						gitRepositoryUrl
							? getCommitUrl({
								repositoryUrl: gitRepositoryUrl,
								gitHash: bundle.gitHash,
							})
							: undefined
					}
					target="_blank"
					rel="noreferrer"
				>
					<strong>Commit:</strong>{" "}
					<span className="underline break-all">{bundle.gitHash}</span>
				</a>
				<p>
					<strong>Enabled:</strong> {enabled ? "✅" : "❌"}
				</p>
			</div>
		</div>
	);
}

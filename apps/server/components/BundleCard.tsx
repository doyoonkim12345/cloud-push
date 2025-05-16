import type { Bundle, UpdatePolicy } from "@cloud-push/cloud";
import { getCommitUrl } from "@cloud-push/utils";

export function BundleCard({
	bundle,
	index,
	androidLastestBundle,
	iosLatestBundle,
	onUpdatePolicyChange,
	gitRepositoryUrl,
}: {
	bundle: Bundle;
	index: number;
	androidLastestBundle?: Bundle;
	iosLatestBundle?: Bundle;
	onUpdatePolicyChange: (bundle: Bundle, updatePolicy: UpdatePolicy) => void;
	gitRepositoryUrl?: string;
}) {
	const isAndroidLatestBundle =
		androidLastestBundle?.bundleId === bundle.bundleId;
	const isIosLatestBundle = iosLatestBundle?.bundleId === bundle.bundleId;

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="font-semibold text-gray-800 flex items-center gap-4">
						<span className="text-blue-600">#{index + 1}</span> Bundle ID
						<div className="flex gap-2">
							{isAndroidLatestBundle && (
								<span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded">
									Android Latest
								</span>
							)}
							{isIosLatestBundle && (
								<span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded">
									iOS Latest
								</span>
							)}
						</div>
					</h3>
					<p className="text-sm break-all text-gray-600 mt-1">
						{bundle.bundleId}
					</p>
				</div>

				<div className="space-y-2">
					{(
						["FORCE_UPDATE", "NORMAL_UPDATE", "ROLLBACK"] as UpdatePolicy[]
					).map((policy) => (
						<button
							type="button"
							key={policy}
							onClick={() => onUpdatePolicyChange(bundle, policy)}
							className={`px-4 py-1 rounded-md text-xs font-medium transition ${
								bundle.updatePolicy === policy
									? "bg-blue-600 text-white"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}
						>
							{policy.replace("_", " ")}
						</button>
					))}
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
					<span className="underline">{bundle.gitHash}</span>
				</a>
				{/* ✅ 수정된 부분: <p> 태그 밖에 <ul> 위치 */}
				<div>
					<p className="mb-1">
						<strong>Policy Target:</strong>
					</p>
					<ul className="ml-4 list-disc text-xs">
						{bundle.updatePolicy === "ROLLBACK" ? (
							<>
								{bundle.supportAndroid && (
									<li>
										Android → {androidLastestBundle?.bundleId ?? "embedded"}
									</li>
								)}
								{bundle.supportIos && (
									<li>iOS → {iosLatestBundle?.bundleId ?? "embedded"}</li>
								)}
							</>
						) : (
							<>
								{bundle.supportAndroid && (
									<li>
										Android → {androidLastestBundle?.bundleId ?? "latest"}
									</li>
								)}
								{bundle.supportIos && (
									<li>iOS → {iosLatestBundle?.bundleId ?? "latest"}</li>
								)}
							</>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}

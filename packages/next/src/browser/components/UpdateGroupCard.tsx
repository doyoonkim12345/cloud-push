import type { UpdateGroup } from "@cloud-push/cloud";

export function UpdateGroupCard(
	{ index, onForceUpdateRequiredClick, ...updateGroup }: UpdateGroup & { index: number, onForceUpdateRequiredClick: (updateGroupId: string) => void }
) {
	const formatDate = (date: string | number) => {
		return new Date(date).toLocaleString('ko-KR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	};


	return (
		<div className="update-group-card">
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="update-group-header">
				<div className="update-group-title-container">
					<h3 className="update-group-title">
						<span className="update-group-index">#{index + 1}</span>
						<span className="update-group-title-text">Update Group</span>
					</h3>
					<p className="update-group-id">
						<span className="update-group-id-label">ID:</span>
						<code className="update-group-id-value">{updateGroup.id}</code>
					</p>
				</div>
				<button
					style={{ flexShrink: 0 }}
					className={`update-group-force-button ${updateGroup.isForceUpdateRequired ? 'active' : 'inactive'}`}
					onClick={() => onForceUpdateRequiredClick(updateGroup.id)}
				>
					<span className="update-group-force-icon">
						{updateGroup.isForceUpdateRequired ? '🔴' : '⚪'}
					</span>
					Enforce update using this bundle
					<span className="update-group-force-status">
						{updateGroup.isForceUpdateRequired ? 'ON' : 'OFF'}
					</span>
				</button>
			</div>

			<div className="update-group-details">
				<div className="update-group-info-grid">
					<div className="update-group-info-item">
						<span className="update-group-info-label">
							<span className="update-group-info-icon">🌍</span>
							Environment
						</span>
						<span className="update-group-info-value update-group-environment">
							{updateGroup.environment}
						</span>
					</div>

					<div className="update-group-info-item">
						<span className="update-group-info-label">
							<span className="update-group-info-icon">📅</span>
							Created At
						</span>
						<span className="update-group-info-value">
							{formatDate(updateGroup.createdAt)}
						</span>
					</div>

					<div className="update-group-info-item">
						<span className="update-group-info-label">
							<span className="update-group-info-icon">🔧</span>
							Runtime Version
						</span>
						<span className="update-group-info-value">
							<code>{updateGroup.runtimeVersion}</code>
						</span>
					</div>

					<div className="update-group-info-item">
						<span className="update-group-info-label">
							<span className="update-group-info-icon">🔗</span>
							Git Hash
						</span>
						<span className="update-group-info-value">
							<code className="update-group-git-hash">{updateGroup.gitHash}</code>
						</span>
					</div>

					<div className="update-group-info-item">
						<span className="update-group-info-label">
							<span className="update-group-info-icon">🔐</span>
							Code Signing
						</span>
						<span className={`update-group-info-value update-group-status ${updateGroup.codeSigning ? 'enabled' : 'disabled'}`}>
							{updateGroup.codeSigning ? '✅ Enabled' : '❌ Disabled'}
						</span>
					</div>

					<div className="update-group-info-item">
						<span className="update-group-info-label">
							<span className="update-group-info-icon">📱</span>
							Platform Support
						</span>
						<span className="update-group-info-value">
							<span className={`update-group-platform ${updateGroup.supportAndroid ? 'supported' : 'unsupported'}`}>
								Android {updateGroup.supportAndroid ? '✅' : '❌'}
							</span>
							{', '}
							<span className={`update-group-platform ${updateGroup.supportIos ? 'supported' : 'unsupported'}`}>
								iOS {updateGroup.supportIos ? '✅' : '❌'}
							</span>
						</span>
					</div>
				</div>

				{updateGroup.message && (
					<div className="update-group-message">
						<span className="update-group-message-label">
							<span className="update-group-info-icon">💬</span>
							Message
						</span>
						<p className="update-group-message-content">{updateGroup.message}</p>
					</div>
				)}
			</div>
		</div>
	);
}

"use client"

import type { RuntimeVersionMetadata, RuntimeVersionUpdateStatus } from "@cloud-push/cloud";
import { runtimeVersionQueries } from "../queries/runtimeVersionQueries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "../services";

interface RuntimeVersionSelectorProps {
	selectedRuntimeVersion: string | null;
	onChange: (selectedRuntimeVersion: string) => void;
	metadata: RuntimeVersionMetadata | null;
	branchId: string;
}

interface RuntimeVersionCardProps {
	runtimeVersion: string;
	isSelected: boolean;
	runtimeVersionUpdateStatus: RuntimeVersionUpdateStatus | null;
	onChange: (runtimeVersion: string) => void;
	onDeprecatedClick: (runtimeVersion: string) => void;
	onForceUpdateClick: (runtimeVersion: string) => void;
	versionIndex: number;
	totalVersions: number;
}

export function RuntimeVersionSelector({
	branchId,
	onChange,
	metadata,
	selectedRuntimeVersion,
}: RuntimeVersionSelectorProps) {

	const { data: runtimeVersionUpdateStatus } = useQuery({
		...runtimeVersionQueries.updateStatus(branchId!),
		enabled: !!branchId
	})

	const runtimeVersions = metadata?.runtimeVersions ?? []

	const queryClient = useQueryClient()

	const handleDeprecatedClick = async (runtimeVersion: string) => {
		if (!metadata) return
		await services.updateRuntimeVersionUpdateStatus(branchId, {
			...(runtimeVersionUpdateStatus ?? {}),
			[runtimeVersion]: {
				...(runtimeVersionUpdateStatus?.[runtimeVersion] ?? { isForceUpdateRequired: false }),
				isDeprecated: !runtimeVersionUpdateStatus?.[runtimeVersion]?.isDeprecated,
			}
		})
		await queryClient.invalidateQueries({ queryKey: runtimeVersionQueries.updateStatus(branchId).queryKey })
	}

	const handleForceUpdateRequiredClick = async (runtimeVersion: string) => {
		// Force update is not available for runtime versions in the current type definition
		// This functionality is only available for update groups
		console.log('Force update not supported for runtime versions:', runtimeVersion);
	}

	const getVersionStats = () => {
		const total = runtimeVersions.length;
		const deprecated = runtimeVersions.filter(v =>
			runtimeVersionUpdateStatus?.[v]?.isDeprecated
		).length;
		const active = total - deprecated;

		return { total, deprecated, active };
	};

	const stats = getVersionStats();

	return (
		<div className="runtime-version-selector">
			<div className="runtime-version-header">
				<div className="runtime-version-header-content">
					<h2 className="runtime-version-title">
						<span className="runtime-version-title-icon">⚙️</span>
						Runtime Version Management
					</h2>
					<p className="runtime-version-subtitle">
						Manage deployment targets and version lifecycle
					</p>
				</div>

				<div className="runtime-version-stats">
					<div className="runtime-version-stat-item">
						<span className="runtime-version-stat-value">{stats.total}</span>
						<span className="runtime-version-stat-label">Total</span>
					</div>
					<div className="runtime-version-stat-item runtime-version-stat-active">
						<span className="runtime-version-stat-value">{stats.active}</span>
						<span className="runtime-version-stat-label">Active</span>
					</div>
					<div className="runtime-version-stat-item runtime-version-stat-deprecated">
						<span className="runtime-version-stat-value">{stats.deprecated}</span>
						<span className="runtime-version-stat-label">Deprecated</span>
					</div>
				</div>
			</div>

			{runtimeVersions.length === 0 ? (
				<div className="runtime-version-empty">
					<div className="runtime-version-empty-icon">📦</div>
					<h3 className="runtime-version-empty-title">No Runtime Versions</h3>
					<p className="runtime-version-empty-description">
						No runtime versions are available for this branch. Deploy your first version to get started.
					</p>
				</div>
			) : (
				<div className="runtime-version-grid">
					{runtimeVersions.map((runtimeVersion, index) => (
						<RuntimeVersionCard
							key={runtimeVersion}
							runtimeVersion={runtimeVersion}
							isSelected={runtimeVersion === selectedRuntimeVersion}
							runtimeVersionUpdateStatus={runtimeVersionUpdateStatus ?? null}
							onChange={onChange}
							onDeprecatedClick={handleDeprecatedClick}
							onForceUpdateClick={handleForceUpdateRequiredClick}
							versionIndex={index}
							totalVersions={runtimeVersions.length}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function RuntimeVersionCard({
	runtimeVersion,
	isSelected,
	runtimeVersionUpdateStatus,
	onChange,
	onDeprecatedClick,
	onForceUpdateClick,
	versionIndex,
	totalVersions,
}: RuntimeVersionCardProps) {
	const isDeprecated = runtimeVersionUpdateStatus?.[runtimeVersion]?.isDeprecated ?? false;

	const getVersionDisplayName = (version: string) => {
		// Extract semantic version parts for better display
		const parts = version.split('.');
		if (parts.length >= 2) {
			return {
				major: parts[0],
				minor: parts[1],
				patch: parts[2] || '0',
				full: version
			};
		}
		return { major: version, minor: '', patch: '', full: version };
	};

	const versionInfo = getVersionDisplayName(runtimeVersion);

	return (
		<div
			className={`runtime-version-card-modern ${isSelected ? "selected" : ""} ${isDeprecated ? "deprecated" : ""}`}
		>
			{/* Card Header */}
			<div className="runtime-version-card-header">
				<div className="runtime-version-card-index">
					#{versionIndex + 1}
				</div>
				{isSelected && (
					<div className="runtime-version-selected-badge">
						<span className="runtime-version-selected-icon">✓</span>
						Selected
					</div>
				)}
				{isDeprecated && (
					<div className="runtime-version-deprecated-badge">
						<span className="runtime-version-deprecated-icon">⚠️</span>
						Deprecated
					</div>
				)}
			</div>

			{/* Version Info */}
			<div className="runtime-version-card-body">
				<button
					type="button"
					onClick={() => onChange(runtimeVersion)}
					className="runtime-version-card-button"
				>
					<div className="runtime-version-display">
						<div className="runtime-version-semantic">
							<span className="runtime-version-major">{versionInfo.major}</span>
							{versionInfo.minor && (
								<>
									<span className="runtime-version-dot">.</span>
									<span className="runtime-version-minor">{versionInfo.minor}</span>
								</>
							)}
							{versionInfo.patch && (
								<>
									<span className="runtime-version-dot">.</span>
									<span className="runtime-version-patch">{versionInfo.patch}</span>
								</>
							)}
						</div>
						<div className="runtime-version-full">{versionInfo.full}</div>
					</div>
				</button>
			</div>

			{/* Controls */}
			<div className="runtime-version-card-controls">
				<div className="runtime-version-control-group">
					<div className="runtime-version-control-item-modern">
						<div className="runtime-version-control-info-modern">
							<span className="runtime-version-control-icon-modern">
								{isDeprecated ? "🚫" : "✅"}
							</span>
							<div className="runtime-version-control-text-modern">
								<span className="runtime-version-control-label">Status</span>
								<span className={`runtime-version-control-value ${isDeprecated ? 'deprecated' : 'active'}`}>
									{isDeprecated ? "Deprecated" : "Active"}
								</span>
							</div>
						</div>
						<button
							onClick={() => onDeprecatedClick(runtimeVersion)}
							type="button"
							className={`runtime-version-toggle-modern ${isDeprecated ? "on" : "off"}`}
							aria-label={`Toggle deprecated status for ${runtimeVersion}`}
						>
							<span className="runtime-version-toggle-slider" />
						</button>
					</div>

				</div>
			</div>
		</div>
	);
}

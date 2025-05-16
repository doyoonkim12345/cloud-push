import * as Updates from "expo-updates";
import React from "react";
import { useEffect } from "react";
import {
	Alert,
	ScrollView,
	Button,
	View,
	ActivityIndicator,
	Text,
} from "react-native";

export function HooksTestScreen() {
	const {
		currentlyRunning,
		availableUpdate,
		downloadedUpdate,
		isChecking,
		isDownloading,
		lastCheckForUpdateTimeSinceRestart,
		checkError,
		downloadError,
		initializationError,
	} = Updates.useUpdates();

	/* Automatically apply when new update is downloaded */
	useEffect(() => {
		if (downloadedUpdate) {
			Updates.reloadAsync();
		}
	}, [downloadedUpdate]);

	const onCheckForUpdate = async () => {
		try {
			await Updates.checkForUpdateAsync();
		} catch (err: any) {
			Alert.alert("Update Check Error", err.message);
		}
	};

	const onFetchUpdate = async () => {
		try {
			const res = await Updates.fetchUpdateAsync();
			Alert.alert("Download Complete", JSON.stringify(res, null, 2));
		} catch (err: any) {
			Alert.alert("Download Error", err.message);
		}
	};

	const onReload = () => Updates.reloadAsync();

	return (
		<ScrollView style={{ padding: 20 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
				useUpdates() Test (SDK 52)
			</Text>

			{/* Currently running information */}
			<Section title="Currently Running Build">
				<KeyValue k="Channel" v={currentlyRunning?.channel} />
				<KeyValue k="Runtime Version" v={currentlyRunning?.runtimeVersion} />
				<KeyValue k="Update ID" v={currentlyRunning?.updateId} />
				<KeyValue
					k="Is Embedded Bundle"
					v={currentlyRunning?.isEmbeddedLaunch ? "yes" : "no"}
				/>
			</Section>

			{/* New update found on server */}
			{availableUpdate && (
				<Section title="New Update Found">
					<KeyValue k="Update ID" v={availableUpdate.updateId} />
					<KeyValue
						k="Created At"
						v={availableUpdate.createdAt?.toLocaleString()}
					/>
					<Button
						title={isDownloading ? "Downloading..." : "Download Update"}
						onPress={onFetchUpdate}
						disabled={isDownloading}
					/>
				</Section>
			)}

			{/* Status & Errors */}
			<Section title="Status / Errors">
				<KeyValue
					k="Last Check"
					v={
						lastCheckForUpdateTimeSinceRestart
							? lastCheckForUpdateTimeSinceRestart.toLocaleTimeString()
							: "—"
					}
				/>
				{isChecking && <Status label="Checking server..." />}
				{checkError && (
					<Status label={`Check error: ${checkError.message}`} err />
				)}
				{downloadError && (
					<Status label={`Download error: ${downloadError.message}`} err />
				)}
				{initializationError && (
					<Status
						label={`Initialization error: ${initializationError.message}`}
						err
					/>
				)}
			</Section>

			{/* Manual trigger buttons */}
			<View style={{ marginVertical: 12 }}>
				<Button
					title={isChecking ? "Checking..." : "Check for Updates"}
					onPress={onCheckForUpdate}
					disabled={isChecking}
				/>
				<Button title="Reload App" onPress={onReload} />
			</View>

			{(isChecking || isDownloading) && (
				<View style={{ marginTop: 16, alignItems: "center" }}>
					<ActivityIndicator size="large" />
				</View>
			)}
		</ScrollView>
	);
}

/* ────────── Helper Components ────────── */

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<View style={{ marginBottom: 24 }}>
			<Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
				{title}
			</Text>
			{children}
		</View>
	);
}

function KeyValue({ k, v }: { k: string; v: string | undefined }) {
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				marginBottom: 8,
			}}
		>
			<Text style={{ fontWeight: "500" }}>{k}</Text>
			<Text
				style={{
					color: "gray",
				}}
			>
				{v ?? "—"}
			</Text>
		</View>
	);
}

function Status({ label, err }: { label: string; err?: boolean }) {
	return (
		<Text style={{ marginTop: 4, color: err ? "red" : "gray" }}>{label}</Text>
	);
}

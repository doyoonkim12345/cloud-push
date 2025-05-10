import * as Updates from "expo-updates";
import React, { useEffect } from "react";
import { Alert, Button, ScrollView, Text, View } from "react-native";

export function MethodsTestScreen() {
	const handleCheckForUpdate = async () => {
		try {
			const update = await Updates.checkForUpdateAsync();
			Alert.alert("Check for Update", JSON.stringify(update, null, 2));
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	const handleFetchUpdate = async () => {
		try {
			const update = await Updates.fetchUpdateAsync();
			Alert.alert("Fetch Update", JSON.stringify(update, null, 2));
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	const handleReload = async () => {
		try {
			await Updates.reloadAsync();
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	const handleGetExtraParams = async () => {
		try {
			const params = await Updates.getExtraParamsAsync();
			Alert.alert("Extra Params", JSON.stringify(params, null, 2));
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	const handleSetExtraParam = async () => {
		try {
			await Updates.setExtraParamAsync("userType", "beta");
			Alert.alert("Set Extra Param", "Set userType=beta");
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	const handleClearExtraParam = async () => {
		try {
			await Updates.setExtraParamAsync("userType", null);
			Alert.alert("Cleared Extra Param", "userType removed");
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	const handleReadLogs = async () => {
		try {
			const logs = await Updates.readLogEntriesAsync(3600000);
			Alert.alert("Logs", `Found ${logs.length} logs`);
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	const handleClearLogs = async () => {
		try {
			await Updates.clearLogEntriesAsync();
			Alert.alert("Logs cleared");
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	const handleGetUpdateMetadata = () => {
		try {
			const metadata = Updates.manifest;
			Alert.alert("Update Metadata", JSON.stringify(metadata, null, 2));
		} catch (e) {
			Alert.alert("Error", String(e));
		}
	};

	return (
		<ScrollView style={{ flex: 1, padding: 20 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
				Expo Updates Test
			</Text>

			<Button title="Check for Update" onPress={handleCheckForUpdate} />
			<View style={{ height: 10 }} />
			<Button title="Fetch Update" onPress={handleFetchUpdate} />
			<View style={{ height: 10 }} />
			<Button title="Reload App" onPress={handleReload} />
			<View style={{ height: 10 }} />
			<Button title="Get Extra Params" onPress={handleGetExtraParams} />
			<View style={{ height: 10 }} />
			<Button
				title="Set Extra Param (userType=beta)"
				onPress={handleSetExtraParam}
			/>
			<View style={{ height: 10 }} />
			<Button
				title="Clear Extra Param (userType)"
				onPress={handleClearExtraParam}
			/>
			<View style={{ height: 10 }} />
			<Button title="Read Log Entries (last 1h)" onPress={handleReadLogs} />
			<View style={{ height: 10 }} />
			<Button title="Clear Log Entries" onPress={handleClearLogs} />
			<View style={{ height: 10 }} />
			<Button title="Get Update Metadata" onPress={handleGetUpdateMetadata} />
		</ScrollView>
	);
}

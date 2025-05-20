import React from "react";
import * as Updates from "expo-updates";
import { getUpdateStatus } from "@cloud-push/expo";
import { Alert, View, Button, Text, Image } from "react-native";

export default function HomeScreen() {
	const handlePress = async () => {
		const status = await getUpdateStatus();
		if (status?.isForceUpdateRequired) {
			Alert.alert("Force update is Required");
		} else {
			Alert.alert("No update is required");
		}
	};

	const handleFetchAndReloadClick = async () => {
		const update = await Updates.checkForUpdateAsync();
		if (update.isAvailable) {
			await Updates.fetchUpdateAsync();
			await Updates.reloadAsync();
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>{Updates.updateId}</Text>
			<Image
				style={{ width: 100, height: 100 }}
				source={require("../assets/cloud-push-logo.png")}
			/>
			<Button title="test force update" onPress={handlePress} />
			<Button title="fetch & reload" onPress={handleFetchAndReloadClick} />
		</View>
	);
}

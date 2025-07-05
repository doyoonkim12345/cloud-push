import React from "react";
import * as Updates from "expo-updates";
import { View, Button, Text, Image, } from "react-native";
import { fetchUpdateWithProgressAsync, addProgressListener } from "@cloud-push/expo";


export default function HomeScreen() {
	const handleFetchAndReloadClick = async () => {
		const update = await Updates.checkForUpdateAsync();
		if (update.isAvailable) {
			await Updates.fetchUpdateAsync();
			await Updates.reloadAsync();
		}
	};

	const handleManualUpdateClick = async () => {

		try {

			fetchUpdateWithProgressAsync()

			const subscription = addProgressListener((progress) => {
				console.log("progress", progress);
			});

			subscription.remove();
		} catch (error) {
			console.log("error", error);
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>{Updates.updateId}</Text>
			<Image
				style={{ width: 100, height: 100 }}
				source={require("../assets/cloud-push-logo.png")}
			/>

			<Button title="fetch & reload" onPress={handleFetchAndReloadClick} />
			<Button title="manual update" onPress={handleManualUpdateClick} />
		</View>
	);
}

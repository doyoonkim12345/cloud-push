import React from "react";
import * as Updates from "expo-updates";
import { View, Button, Text, Image } from "react-native";

export default function HomeScreen() {
	const handleFetchAndReloadClick = async () => {
		const update = await Updates.checkForUpdateAsync();
		if (update.isAvailable) {
			await Updates.fetchUpdateAsync();
			await Updates.reloadAsync();
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
			<Text>{Updates.updateId}</Text>
			<Image
				style={{ width: 100, height: 100 }}
				source={require("../assets/cloud-push-logo.png")}
			/>
			<Button title="fetch & reload" onPress={handleFetchAndReloadClick} />
		</View>
	);
}

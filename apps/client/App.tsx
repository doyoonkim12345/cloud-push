import { StatusBar } from "expo-status-bar";
import { Button, ScrollView, StyleSheet, Text } from "react-native";
import * as Updates from "expo-updates";

export default function App() {
	async function onFetchUpdateAsync() {
		try {
			const update = await Updates.checkForUpdateAsync();

			if (update.isAvailable) {
				const shouldForceUpdate = !!(update.manifest as any)?.extra
					.shouldForceUpdate;

				await Updates.fetchUpdateAsync();

				if (shouldForceUpdate) {
					await Updates.reloadAsync();
				}
			}

			// await Updates.reloadAsync();
		} catch (error) {
			alert(`Error fetching update: ${error}`);
		}
	}

	return (
		<ScrollView style={styles.container}>
			<Text>{Updates.updateId}</Text>
			<Button title="버튼" onPress={onFetchUpdateAsync} />
			<StatusBar style="auto" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

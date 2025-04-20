import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Updates from "expo-updates";
import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [text1, setText1] = useState("");

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      const shouldForceUpdate = !!(update.manifest as any)?.extra
        .shouldForceUpdate;

      // await
      // if (shouldForceUpdate) {
      //   setText("forceUpdate");

      // } else {
      //   Updates.fetchUpdateAsync();
      //   setText("not -forceUpdate");
      // }
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      alert(`Error fetching update: ${error}`);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text>{Updates.updateId}</Text>
      <Button title="버튼" onPress={onFetchUpdateAsync} />
      <Text>{text}</Text>
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

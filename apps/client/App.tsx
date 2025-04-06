import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import * as Updates from "expo-updates";

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="버튼"
        onPress={async () => {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          Alert.alert("업데이트 완료", "업데이트가 완료되었습니다.");
        }}
      />
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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

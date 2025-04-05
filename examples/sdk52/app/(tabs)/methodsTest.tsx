import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import * as Updates from "expo-updates";

const MethodsTestScreen: React.FC = () => {
  const [extraParams, setExtraParams] = useState<Record<string, string> | null>(
    null
  );
  const [logEntries, setLogEntries] = useState<
    Updates.UpdatesLogEntry[] | null
  >(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const handleCheckForUpdate = async () => {
    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        setIsUpdateAvailable(true);
        Alert.alert(
          "Update Available",
          "A new update is available. You can fetch it."
        );
      } else {
        Alert.alert("No Update", "No new updates are currently available.");
      }
    } catch (error: any) {
      Alert.alert("Error", `Failed to check for updates: ${error.message}`);
    }
  };

  const handleFetchUpdate = async () => {
    try {
      const result = await Updates.fetchUpdateAsync();
      if (result.isNew) {
        Alert.alert(
          "Update Fetched",
          "The update has been fetched successfully."
        );
      } else {
        Alert.alert("No New Update", "The fetched update is not new.");
      }
    } catch (error: any) {
      Alert.alert("Error", `Failed to fetch the update: ${error.message}`);
    }
  };

  const handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error: any) {
      Alert.alert("Error", `Failed to reload the app: ${error.message}`);
    }
  };

  const handleClearLogEntries = async () => {
    try {
      await Updates.clearLogEntriesAsync();
      Alert.alert("Logs Cleared", "All update logs have been cleared.");
    } catch (error: any) {
      Alert.alert("Error", `Failed to clear logs: ${error.message}`);
    }
  };

  const handleReadLogEntries = async () => {
    try {
      const logs = await Updates.readLogEntriesAsync(3600000); // Logs from the last hour
      setLogEntries(logs);
      Alert.alert("Logs Retrieved", `Retrieved ${logs.length} log entries.`);
    } catch (error: any) {
      Alert.alert("Error", `Failed to read logs: ${error.message}`);
    }
  };

  const handleGetExtraParams = async () => {
    try {
      const params = await Updates.getExtraParamsAsync();
      setExtraParams(params);
      Alert.alert(
        "Extra Params Retrieved",
        "Successfully retrieved extra params."
      );
    } catch (error: any) {
      Alert.alert("Error", `Failed to get extra params: ${error.message}`);
    }
  };

  const handleSetExtraParam = async () => {
    try {
      await Updates.setExtraParamAsync("testKey", "testValue");
      Alert.alert(
        "Extra Param Set",
        "Successfully set extra param: testKey = testValue"
      );
    } catch (error: any) {
      Alert.alert("Error", `Failed to set extra param: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expo Updates SDK Test</Text>

      {/* 메소드 테스트 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Methods</Text>
        <Button title="Check for Updates" onPress={handleCheckForUpdate} />
        <Button
          title="Fetch Update"
          onPress={handleFetchUpdate}
          disabled={!isUpdateAvailable}
        />
        <Button title="Reload App" onPress={handleReload} />
        <Button title="Clear Log Entries" onPress={handleClearLogEntries} />
        <Button title="Read Log Entries" onPress={handleReadLogEntries} />
        <Button title="Get Extra Params" onPress={handleGetExtraParams} />
        <Button title="Set Extra Param" onPress={handleSetExtraParam} />
      </View>

      {/* 추가 테스트 결과 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Results</Text>
        <Text>
          Extra Params: {extraParams ? JSON.stringify(extraParams) : "N/A"}
        </Text>
        <Text>
          Log Entries:{" "}
          {logEntries ? JSON.stringify(logEntries, null, 2) : "N/A"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default MethodsTestScreen;

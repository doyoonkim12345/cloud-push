import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import * as Updates from "expo-updates";

const HooksTestScreen: React.FC = () => {
  const {
    currentlyRunning,
    availableUpdate,
    downloadedUpdate,
    isUpdateAvailable,
    isUpdatePending,
    isChecking,
    isDownloading,
    checkError,
    downloadError,
    initializationError,
  } = Updates.useUpdates();

  useEffect(() => {
    if (checkError) {
      Alert.alert(
        "Check Error",
        `Failed to check for updates: ${checkError.message}`
      );
    }
    if (downloadError) {
      Alert.alert(
        "Download Error",
        `Failed to download update: ${downloadError.message}`
      );
    }
    if (initializationError) {
      Alert.alert(
        "Initialization Error",
        `Failed to initialize Updates: ${initializationError.message}`
      );
    }
  }, [checkError, downloadError, initializationError]);

  const handleApplyDownloadedUpdate = async () => {
    try {
      if (isUpdatePending) {
        await Updates.reloadAsync();
        Alert.alert(
          "Update Applied",
          "The downloaded update has been applied."
        );
      } else {
        Alert.alert(
          "No Pending Update",
          "There is no pending update to apply."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", `Failed to apply the update: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expo Updates Hook Test</Text>

      {/* 업데이트 상태 표시 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Currently Running</Text>
        <Text>
          Is Embedded Launch:{" "}
          {currentlyRunning?.isEmbeddedLaunch ? "true" : "false"}
        </Text>
        <Text>
          Runtime Version: {currentlyRunning?.runtimeVersion || "N/A"}
        </Text>
        <Text>Update ID: {currentlyRunning?.updateId || "N/A"}</Text>
        <Text>
          Created At: {currentlyRunning?.createdAt?.toISOString() || "N/A"}
        </Text>
      </View>

      {/* 사용 가능한 업데이트 표시 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Available Update</Text>
        <Text>Is Update Available: {isUpdateAvailable ? "true" : "false"}</Text>
        <Text>Available Update ID: {availableUpdate?.updateId || "N/A"}</Text>
        <Text>
          Available Update Created At:{" "}
          {availableUpdate?.createdAt?.toISOString() || "N/A"}
        </Text>
      </View>

      {/* 다운로드된 업데이트 표시 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Downloaded Update</Text>
        <Text>Downloaded Update ID: {downloadedUpdate?.updateId || "N/A"}</Text>
        <Text>
          Downloaded Update Created At:{" "}
          {downloadedUpdate?.createdAt?.toISOString() || "N/A"}
        </Text>
      </View>

      {/* 상태 표시 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Update Process</Text>
        <Text>Is Checking: {isChecking ? "true" : "false"}</Text>
        <Text>Is Downloading: {isDownloading ? "true" : "false"}</Text>
        <Text>Is Update Pending: {isUpdatePending ? "true" : "false"}</Text>
      </View>

      {/* 업데이트 적용 버튼 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Actions</Text>
        <Button
          title="Apply Downloaded Update"
          onPress={handleApplyDownloadedUpdate}
          disabled={!isUpdatePending}
        />
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

export default HooksTestScreen;

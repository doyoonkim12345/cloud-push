import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import * as Updates from "expo-updates";

const ConstantsTestScreen: React.FC = () => {
  const [constants, setConstants] = useState<{
    isEnabled: boolean | null;
    isEmbeddedLaunch: boolean | null;
    isEmergencyLaunch: boolean | null;
    createdAt: string | null;
    runtimeVersion: string | null;
    updateId: string | null;
    latestContext: Updates.UpdatesNativeStateMachineContext | null;
    launchDuration: number | null;
    manifest: Partial<Updates.Manifest>;
  }>({
    isEnabled: null,
    isEmbeddedLaunch: null,
    isEmergencyLaunch: null,
    createdAt: null,
    runtimeVersion: null,
    updateId: null,
    latestContext: null,
    launchDuration: null,
    manifest: {},
  });

  useEffect(() => {
    loadConstants();
  }, []);

  const loadConstants = async () => {
    try {
      setConstants({
        isEnabled: Updates.isEnabled,
        isEmbeddedLaunch: Updates.isEmbeddedLaunch,
        isEmergencyLaunch: Updates.isEmergencyLaunch,
        createdAt: Updates.createdAt ? Updates.createdAt.toISOString() : null,
        runtimeVersion: Updates.runtimeVersion,
        updateId: Updates.updateId,
        latestContext: Updates.latestContext,
        launchDuration: Updates.launchDuration,
        manifest: Updates.manifest,
      });
    } catch (error: any) {
      Alert.alert("Error", `Failed to load constants: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expo Updates Constants Test</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Constants</Text>
        <Text>
          isEnabled:{" "}
          {constants.isEnabled !== null
            ? `${constants.isEnabled}`
            : "Loading..."}
        </Text>
        <Text>
          isEmbeddedLaunch:{" "}
          {constants.isEmbeddedLaunch !== null
            ? `${constants.isEmbeddedLaunch}`
            : "Loading..."}
        </Text>
        <Text>
          isEmergencyLaunch:{" "}
          {constants.isEmergencyLaunch !== null
            ? `${constants.isEmergencyLaunch}`
            : "Loading..."}
        </Text>
        <Text>createdAt: {constants.createdAt || "N/A"}</Text>
        <Text>runtimeVersion: {constants.runtimeVersion || "N/A"}</Text>
        <Text>updateId: {constants.updateId || "N/A"}</Text>
        <Text>
          latestContext:{" "}
          {constants.latestContext
            ? JSON.stringify(constants.latestContext, null, 2)
            : "N/A"}
        </Text>
        <Text>
          launchDuration:{" "}
          {constants.launchDuration !== null
            ? `${constants.launchDuration} ms`
            : "N/A"}
        </Text>
        <Text>
          manifest:{" "}
          {constants.manifest
            ? JSON.stringify(constants.manifest, null, 2)
            : "N/A"}
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

export default ConstantsTestScreen;

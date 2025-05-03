import * as Updates from 'expo-updates'
import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";

export default function ConstantsTestScreen() {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    setInfo({
      channel: Updates.channel,
      createdAt: Updates.createdAt,
      emergencyLaunchReason: Updates.emergencyLaunchReason,
      isEmbeddedLaunch: Updates.isEmbeddedLaunch,
      isEmergencyLaunch: Updates.isEmergencyLaunch,
      isEnabled: Updates.isEnabled,
      launchDuration: Updates.launchDuration,
      runtimeVersion: Updates.runtimeVersion,
      updateId: Updates.updateId,
      manifest: Updates.manifest,
    });
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Constants Test</Text>
      {Object.entries(info).map(([key, value]) => (
        <View key={key} style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{key}</Text>
          <Text>{JSON.stringify(value, null, 2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

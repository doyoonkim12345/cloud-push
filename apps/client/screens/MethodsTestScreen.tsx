import * as Updates from 'expo-updates'
import React from 'react';
import { Alert, Button, ScrollView, Text, View } from 'react-native';

export function MethodsTestScreen() {
  const handleCheckForUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      Alert.alert("Check for Update", JSON.stringify(update, null, 2));
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const handleFetchUpdate = async () => {
    try {
      const update = await Updates.fetchUpdateAsync();
      Alert.alert("Fetch Update", JSON.stringify(update, null, 2));
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const handleGetExtraParams = async () => {
    try {
      const params = await Updates.getExtraParamsAsync();
      Alert.alert("Extra Params", JSON.stringify(params, null, 2));
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const handleReadLogs = async () => {
    try {
      const logs = await Updates.readLogEntriesAsync(3600000);
      Alert.alert("Logs", `Found ${logs.length} logs`);
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const handleClearLogs = async () => {
    try {
      await Updates.clearLogEntriesAsync();
      Alert.alert("Logs cleared");
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Methods Test</Text>
      <Button title="Check for Update" onPress={handleCheckForUpdate} />
      <View style={{ height: 10 }} />
      <Button title="Fetch Update" onPress={handleFetchUpdate} />
      <View style={{ height: 10 }} />
      <Button title="Reload App" onPress={handleReload} />
      <View style={{ height: 10 }} />
      <Button title="Get Extra Params" onPress={handleGetExtraParams} />
      <View style={{ height: 10 }} />
      <Button title="Read Log Entries" onPress={handleReadLogs} />
      <View style={{ height: 10 }} />
      <Button title="Clear Log Entries" onPress={handleClearLogs} />
    </ScrollView>
  );
}

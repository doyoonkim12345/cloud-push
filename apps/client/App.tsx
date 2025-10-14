import { StatusBar } from 'expo-status-bar';
import {
  useUpdates,
  manifest,
  updateId,
  channel,
  checkAutomatically,
  createdAt,
  isEmbeddedLaunch,
  isEnabled,
  latestContext,
  launchDuration,
  runtimeVersion,
  checkForUpdateAsync,
  clearLogEntriesAsync,
  fetchUpdateAsync,
  readLogEntriesAsync,
  reloadAsync
} from 'expo-updates';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  AppState,
  Pressable
} from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { getUpdateStatus } from '@cloud-push/expo'

export default function App() {
  const updateInfo = useUpdates();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const showValue = (title: string, value: any) => {
    const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    Alert.alert(title, displayValue);
  };

  const handleCheckForUpdate = async () => {
    setIsLoading(true);
    try {
      const result = await checkForUpdateAsync();
      Alert.alert('Check for Update Result', JSON.stringify(result, null, 2));
    } catch (error) {
      Alert.alert('Error', `Check for update failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchUpdate = async () => {
    setIsLoading(true);
    try {
      const result = await fetchUpdateAsync();
      Alert.alert('Fetch Update Result', JSON.stringify(result, null, 2));
    } catch (error) {
      Alert.alert('Error', `Fetch update failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadLogs = async () => {
    setIsLoading(true);
    try {
      const logEntries = await readLogEntriesAsync(100);
      setLogs(logEntries);
      Alert.alert('Logs Read', `Found ${logEntries.length} log entries. Check the Logs section below.`);
    } catch (error) {
      Alert.alert('Error', `Read logs failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    setIsLoading(true);
    try {
      await clearLogEntriesAsync();
      setLogs([]);
      Alert.alert('Success', 'Logs cleared successfully');
    } catch (error) {
      Alert.alert('Error', `Clear logs failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReload = async () => {
    try {
      await reloadAsync();
    } catch (error) {
      Alert.alert('Error', `Reload failed: ${error}`);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderValueRow = (label: string, value: any, onPress?: () => void) => (
    <View style={styles.valueRow}>
      <Text style={styles.label}>{label}:</Text>
      <Button
        title={typeof value === 'object' ? 'View Object' : String(value)}
        onPress={() => onPress ? onPress() : showValue(label, value)}
      />
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );


  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextState) => {
      console.log("App state changed to:", nextState);

      if (nextState === "background") {
        // 👉 앱이 백그라운드로 갔을 때
        const a = await getUpdateStatus()
        console.log(a)
      } else if (nextState === "active") {
        // 👉 앱이 다시 포그라운드로 돌아왔을 때
        const a = await getUpdateStatus()
        console.log(a)
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Expo Updates Test Screen</Text>
      <Pressable onPress={() => {
        console.log("Get Update Status")
        getUpdateStatus()
      }}>
        <Text>Get Update Status</Text>
      </Pressable>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      )}

      {/* useUpdates Hook */}
      {renderSection('🧩 useUpdates Hook', (
        <View>
          {renderValueRow('isUpdateAvailable', updateInfo.isUpdateAvailable)}
          {renderValueRow('isUpdatePending', updateInfo.isUpdatePending)}
          {renderValueRow('isChecking', updateInfo.isChecking)}
          {renderValueRow('isDownloading', updateInfo.isDownloading)}
          {renderValueRow('availableUpdate', updateInfo.availableUpdate)}
          {renderValueRow('downloadedUpdate', updateInfo.downloadedUpdate)}
          {renderValueRow('checkError', updateInfo.checkError)}
          {renderValueRow('downloadError', updateInfo.downloadError)}
        </View>
      ))}

      {/* Constants */}
      {renderSection('🧱 Constants', (
        <View>
          {renderValueRow('updateId', updateId)}
          {renderValueRow('manifest', manifest)}
          {renderValueRow('channel', channel)}
          {renderValueRow('checkAutomatically', checkAutomatically)}
          {renderValueRow('createdAt', createdAt)}
          {renderValueRow('isEmbeddedLaunch', isEmbeddedLaunch)}
          {renderValueRow('isEnabled', isEnabled)}
          {renderValueRow('latestContext', latestContext)}
          {renderValueRow('launchDuration', launchDuration)}
          {renderValueRow('runtimeVersion', runtimeVersion)}
        </View>
      ))}

      {/* Methods */}
      {renderSection('🛠 Methods', (
        <View style={styles.methodsContainer}>
          <Button
            title="Check for Update"
            onPress={handleCheckForUpdate}
            disabled={isLoading}
          />
          <Button
            title="Fetch Update"
            onPress={handleFetchUpdate}
            disabled={isLoading}
          />
          <Button
            title="Read Log Entries"
            onPress={handleReadLogs}
            disabled={isLoading}
          />
          <Button
            title="Clear Log Entries"
            onPress={handleClearLogs}
            disabled={isLoading}
          />
          <Button
            title="Reload App"
            onPress={handleReload}
            disabled={isLoading}
            color="red"
          />
        </View>
      ))}

      {/* Logs Section */}
      {logs.length > 0 && renderSection('📋 Logs', (
        <View>
          <Text style={styles.logsCount}>Total Logs: {logs.length}</Text>
          {logs.slice(0, 5).map((log, index) => (
            <View key={index} style={styles.logEntry}>
              <Text style={styles.logText}>
                {JSON.stringify(log, null, 2)}
              </Text>
            </View>
          ))}
          {logs.length > 5 && (
            <Text style={styles.moreLogsText}>... and {logs.length - 5} more logs</Text>
          )}
        </View>
      ))}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    flex: 1,
    color: '#666',
    fontWeight: '500',
  },
  methodsContainer: {
    gap: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  logsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  logEntry: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  moreLogsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

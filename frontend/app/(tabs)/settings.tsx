import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all transaction data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement reset functionality
            Alert.alert('Success', 'All data has been reset.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Manage your account and app preferences
          </Text>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsContainer}>
          {/* Dark Mode Toggle */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e5e7eb', true: '#fce4ec' }}
              thumbColor={darkMode ? '#e91e63' : '#f3f4f6'}
            />
          </View>

          {/* Reset Data */}
          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleResetData}
          >
            <Text style={styles.dangerText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>TrxFlow v1.0.0</Text>
          <Text style={styles.infoSubtext}>
            Automated bKash Transaction Tracker
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  dangerItem: {
    borderColor: '#fee2e2',
  },
  dangerText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 32,
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

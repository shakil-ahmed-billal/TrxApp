import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionModal } from '@/components/PermissionModal';
import { ICONS } from '@/src/constants/icons';
import { getFinancialAdvice } from '@/src/services/geminiService';
import apiClient from '@/src/services/apiClient';
import { Transaction } from '@/src/types';
import smsListener from '@/src/services/smsListener';

export default function DashboardScreen() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string>('Loading financial insights...');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  const loadTransactions = async () => {
    try {
      const result = await apiClient.getAllTransactions();

      if (result.success && result.data) {
        const sortedTransactions = result.data.sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        setTransactions(sortedTransactions);
        
        // Get current balance from the latest transaction
        if (sortedTransactions.length > 0 && sortedTransactions[0].balance !== undefined) {
          setCurrentBalance(sortedTransactions[0].balance);
        }

        // Get AI advice
        try {
          const advice = await getFinancialAdvice(sortedTransactions);
          setAiAdvice(advice || 'No advice available at the moment.');
        } catch (err) {
          console.error('Error getting AI advice:', err);
          setAiAdvice('AI insights temporarily unavailable.');
        }
      }
    } catch (err: any) {
      console.error('Error loading transactions:', err);
      setAiAdvice('Unable to load financial insights.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();

    // Initialize SMS listener on Android
    if (Platform.OS === 'android' && hasPermission) {
      smsListener.startListening().then((started) => {
        if (started) {
          // Reload transactions when new SMS is received
          setTimeout(() => {
            loadTransactions();
          }, 2000);
        }
      });
    }

    return () => {
      if (Platform.OS === 'android') {
        smsListener.stopListening();
      }
    };
  }, [hasPermission]);

  const handleGrantPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await smsListener.requestPermission();
      if (granted) {
        setHasPermission(true);
        setShowPermissionModal(false);
        await smsListener.startListening();
      }
    } else {
      setHasPermission(true);
      setShowPermissionModal(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  // Calculate weekly change (mock for now)
  const weeklyChange = transactions.length > 0 
    ? transactions.slice(0, 7).reduce((sum, t) => sum + (t.amount || 0), 0)
    : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PermissionModal
        isOpen={showPermissionModal}
        onGrant={handleGrantPermission}
        onDeny={() => setShowPermissionModal(false)}
        title="SMS Access Permission"
        description="TrxFlow needs to read your SMS to automatically track your BKash transactions and provide AI insights."
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Hello, User</Text>
            <Text style={styles.headerSubtitle}>Welcome back to TrxFlow</Text>
          </View>
          <View style={styles.headerIcon}>
            <ICONS.Dashboard size={24} color="#e91e63" />
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>৳ {currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceFooterLeft}>
              <View style={styles.greenIcon}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              <Text style={styles.weeklyChange}>+ ৳ {weeklyChange.toLocaleString()} this week</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Insight Section */}
        <View style={styles.aiInsightCard}>
          <View style={styles.aiInsightHeader}>
            <Text style={styles.aiInsightIcon}>💡</Text>
            <Text style={styles.aiInsightTitle}>TrxFlow AI Insight</Text>
          </View>
          <Text style={styles.aiInsightText}>{aiAdvice}</Text>
        </View>

        {/* Activity Overview */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Activity Overview</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>
              {transactions.length > 0 
                ? `${transactions.length} transaction${transactions.length !== 1 ? 's' : ''} this month`
                : 'No transactions yet'}
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fce4ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: '#e91e63',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceLabel: {
    color: '#fce4ec',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 16,
  },
  balanceFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weeklyChange: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiInsightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fce4ec',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiInsightIcon: {
    fontSize: 20,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  aiInsightText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    height: 200,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient, { Transaction } from '@/src/services/apiClient';
import smsListener from '@/src/services/smsListener';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listenerStatus, setListenerStatus] = useState(false);

  const loadTransactions = async () => {
    try {
      setError(null);
      const result = await apiClient.getAllTransactions();

      if (result.success && result.data) {
        // Sort by date (newest first)
        const sortedTransactions = result.data.sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        setTransactions(sortedTransactions);
      } else {
        setError(result.message || 'Failed to load transactions');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();

    // Initialize SMS listener on Android
    if (Platform.OS === 'android') {
      initializeSmsListener();
    }

    // Refresh transactions every 30 seconds
    const interval = setInterval(() => {
      loadTransactions();
    }, 30000);

    return () => {
      clearInterval(interval);
      if (Platform.OS === 'android') {
        smsListener.stopListening();
      }
    };
  }, []);

  const initializeSmsListener = async () => {
    try {
      const started = await smsListener.startListening();
      setListenerStatus(started);
      if (started) {
        setTimeout(() => {
          loadTransactions();
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to initialize SMS listener:', err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const getTransactionType = (tx: Transaction): string => {
    // Determine transaction type based on rawSms content
    const rawSms = tx.rawSms?.toLowerCase() || '';
    if (rawSms.includes('received') || rawSms.includes('received from')) {
      return 'Received Money';
    } else if (rawSms.includes('cash out') || rawSms.includes('sent')) {
      return 'Cash Out';
    } else if (rawSms.includes('payment')) {
      return 'Payment';
    } else if (rawSms.includes('send money')) {
      return 'Send Money';
    }
    return 'Transaction';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Received Money':
        return 'arrow-downward';
      case 'Cash Out':
      case 'Send Money':
        return 'arrow-upward';
      case 'Payment':
        return 'payment';
      default:
        return 'swap-horiz';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'Received Money':
        return { bg: '#dbeafe', color: '#2563eb' };
      case 'Cash Out':
      case 'Send Money':
        return { bg: '#fee2e2', color: '#dc2626' };
      case 'Payment':
        return { bg: '#dcfce7', color: '#16a34a' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number): string => {
    return `৳${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSubtitle}>History from Database</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>
              Transactions will appear here when bKash SMS messages are received
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsContainer}>
            {transactions.map((tx) => {
              const type = getTransactionType(tx);
              const icon = getTransactionIcon(type);
              const colors = getTransactionColor(type);
              const isOutgoing = type === 'Cash Out' || type === 'Send Money';

              return (
                <View key={tx.id} style={styles.transactionCard}>
                  <View style={[styles.transactionIcon, { backgroundColor: colors.bg }]}>
                    <MaterialIcons name={icon as any} size={24} color={colors.color} />
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionType}>{type}</Text>
                    <Text style={styles.transactionDetails} numberOfLines={1}>
                      {tx.senderNumber || tx.recipient || 'N/A'} • TrxID: {tx.trxId || tx.trxID || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.transactionAmount}>
                    <Text style={[styles.amountText, isOutgoing ? styles.amountOutgoing : styles.amountIncoming]}>
                      {isOutgoing ? '-' : '+'} {formatAmount(tx.amount)}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(tx.createdAt)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  transactionsContainer: {
    gap: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 16,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionContent: {
    flex: 1,
    minWidth: 0,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  amountIncoming: {
    color: '#16a34a',
  },
  amountOutgoing: {
    color: '#dc2626',
  },
  transactionDate: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

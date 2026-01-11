import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import apiClient, { Transaction } from "@/src/services/apiClient";
import smsListener from "@/src/services/smsListener";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listenerStatus, setListenerStatus] = useState(false);

  // Load transactions from API
  const loadTransactions = async () => {
    try {
      setError(null);
      const result = await apiClient.getAllTransactions();

      if (result.success && result.data) {
        setTransactions(result.data);
      } else {
        setError(result.message || "Failed to load transactions");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTransactions();

    // Initialize SMS listener on Android
    if (Platform.OS === "android") {
      initializeSmsListener();
    }

    // Refresh transactions every 30 seconds
    const interval = setInterval(() => {
      loadTransactions();
    }, 30000);

    return () => {
      clearInterval(interval);
      if (Platform.OS === "android") {
        smsListener.stopListening();
      }
    };
  }, []);

  // Initialize SMS listener
  const initializeSmsListener = async () => {
    try {
      const started = await smsListener.startListening();
      setListenerStatus(started);
      if (started) {
        // Reload transactions when new SMS is received
        // The listener service handles saving, so we refresh the list
        setTimeout(() => {
          loadTransactions();
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to initialize SMS listener:", err);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  // Format date for display
  const formatDate = (date: string, time: string) => {
    return `${date} ${time}`;
  };

  // Format amount for display
  const formatAmount = (amount: number) => {
    return `Tk ${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>
            Loading transactions...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Transactions</ThemedText>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusIndicator,
                listenerStatus && styles.statusActive,
              ]}
            />
            <ThemedText style={styles.statusText}>
              {listenerStatus ? "Listening for SMS" : "SMS Listener Off"}
            </ThemedText>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        {/* Transaction Count */}
        <View style={styles.countContainer}>
          <ThemedText style={styles.countText}>
            Total: {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </ThemedText>
        </View>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No transactions found
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Transactions will appear here when bKash SMS messages are received
            </ThemedText>
          </View>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionHeaderLeft}>
                  <ThemedText type="defaultSemiBold" style={styles.amountText}>
                    {formatAmount(transaction.amount)}
                  </ThemedText>
                  <ThemedText style={styles.providerText}>
                    {transaction.provider}
                  </ThemedText>
                </View>
                <View style={styles.transactionHeaderRight}>
                  <ThemedText style={styles.dateText}>
                    {formatDate(
                      transaction.transactionDate,
                      transaction.transactionTime
                    )}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>From:</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {transaction.senderNumber}
                  </ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>TrxID:</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {transaction.trxId}
                  </ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Balance:</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {formatAmount(transaction.balance)}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#999",
  },
  statusActive: {
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 14,
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  errorText: {
    color: "#F44336",
    textAlign: "center",
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  countText: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  transactionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  transactionHeaderLeft: {
    flex: 1,
  },
  transactionHeaderRight: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 24,
    marginBottom: 4,
  },
  providerText: {
    fontSize: 14,
    opacity: 0.7,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.6,
  },
  transactionDetails: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
  },
  bottomSpacing: {
    height: 20,
  },
});

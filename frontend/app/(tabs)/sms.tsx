import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/src/services/apiClient';
import { SMSMessage, Transaction } from '@/src/types';

export default function SMSScreen() {
  const [smsMessages, setSmsMessages] = useState<SMSMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSMSMessages = async () => {
    try {
      const result = await apiClient.getAllTransactions();

      if (result.success && result.data) {
        // Convert transactions to SMS messages
        const messages: SMSMessage[] = result.data.map((tx: Transaction, index: number) => {
          // Format date from transaction
          const date = tx.createdAt 
            ? new Date(tx.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }) + ' ' + (tx.transactionTime || '')
            : '';

          return {
            id: String(tx.id),
            address: 'bkash',
            body: tx.rawSms || '',
            date: date,
            isRead: index < 3, // First 3 are read
          };
        });

        // Sort by date (newest first)
        messages.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        setSmsMessages(messages);
      }
    } catch (err: any) {
      console.error('Error loading SMS messages:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSMSMessages();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSMSMessages();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Loading messages...</Text>
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
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>Automated BKash Logs</Text>
        </View>

        {/* SMS Messages List */}
        {smsMessages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages found</Text>
            <Text style={styles.emptySubtext}>
              SMS messages will appear here when bKash transactions are received
            </Text>
          </View>
        ) : (
          <View style={styles.messagesContainer}>
            {smsMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageCard,
                  msg.isRead ? styles.messageCardRead : styles.messageCardUnread,
                ]}
              >
                <View style={styles.messageHeader}>
                  <Text style={styles.messageAddress}>BKASH</Text>
                  <Text style={styles.messageDate}>{msg.date}</Text>
                </View>
                <Text style={styles.messageBody} numberOfLines={3}>
                  {msg.body}
                </Text>
                {!msg.isRead && <View style={styles.unreadIndicator} />}
              </View>
            ))}
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
  messagesContainer: {
    gap: 12,
  },
  messageCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  messageCardRead: {
    backgroundColor: '#ffffff',
    borderColor: '#f3f4f6',
  },
  messageCardUnread: {
    backgroundColor: '#fef7ff',
    borderColor: '#fce4ec',
    borderWidth: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  messageAddress: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e91e63',
    textTransform: 'uppercase',
  },
  messageDate: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
  },
  messageBody: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e91e63',
    marginTop: 8,
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

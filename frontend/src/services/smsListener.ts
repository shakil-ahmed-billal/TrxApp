/**
 * SMS Listener Service
 *
 * Note: This service requires a native SMS listener module.
 * For Expo bare workflow, you need to install:
 * - react-native-android-sms-listener (or similar)
 * - Configure Android permissions in app.json
 *
 * This is a placeholder implementation that shows the structure.
 * You'll need to implement the actual native module integration.
 */

import { PermissionsAndroid, Platform } from "react-native";
import { parseBkashSms } from "../utils/smsParser";
import apiClient, { CreateTransactionPayload } from "./apiClient";

// Type definitions for SMS listener (will be replaced by actual library types)
interface SmsData {
  body: string;
  address: string; // sender number/name
  date?: number;
}

type SmsListenerCallback = (sms: SmsData) => void;

class SmsListenerService {
  private isListening: boolean = false;
  private listenerId: any = null;
  private onSmsReceivedCallback?: (sms: SmsData) => void;

  /**
   * Request SMS read permission (Android)
   */
  async requestPermission(): Promise<boolean> {
    if (Platform.OS !== "android") {
      console.warn("SMS listener is only supported on Android");
      return false;
    }

    try {
      // Request SMS read permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "SMS Permission",
          message:
            "This app needs access to read SMS to track bKash transactions.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error("Error requesting SMS permission:", error);
      return false;
    }
  }

  /**
   * Check if SMS permission is granted
   */
  async checkPermission(): Promise<boolean> {
    if (Platform.OS !== "android") {
      return false;
    }

    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      return result;
    } catch (error) {
      console.error("Error checking SMS permission:", error);
      return false;
    }
  }

  /**
   * Start listening for SMS messages
   *
   * NOTE: This requires a native module like react-native-android-sms-listener
   * You'll need to install the package and configure it properly.
   *
   * Example implementation with react-native-android-sms-listener:
   *
   * import SmsListener from 'react-native-android-sms-listener';
   *
   * this.listenerId = SmsListener.addListener((sms: SmsData) => {
   *   this.handleSms(sms);
   * });
   */
  async startListening(): Promise<boolean> {
    if (Platform.OS !== "android") {
      console.warn("SMS listener is only supported on Android");
      return false;
    }

    const hasPermission = await this.checkPermission();
    if (!hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) {
        console.error("SMS permission not granted");
        return false;
      }
    }

    // TODO: Implement actual SMS listener
    // This is a placeholder - you need to integrate a native module
    // For example: react-native-android-sms-listener

    console.warn(
      "SMS listener not implemented. Please install react-native-android-sms-listener or similar."
    );
    console.warn("Example implementation:");
    console.warn(`
      import SmsListener from 'react-native-android-sms-listener';
      
      this.listenerId = SmsListener.addListener((sms: SmsData) => {
        this.handleSms(sms);
      });
    `);

    this.isListening = false;
    return false;
  }

  /**
   * Stop listening for SMS messages
   */
  stopListening(): void {
    if (this.listenerId) {
      // TODO: Remove listener using the native module
      // Example: SmsListener.removeListener(this.listenerId);
      this.listenerId = null;
    }
    this.isListening = false;
  }

  /**
   * Handle incoming SMS
   */
  private async handleSms(sms: SmsData): Promise<void> {
    try {
      // Parse the SMS
      const parseResult = parseBkashSms(sms.address, sms.body);

      if (!parseResult.success || !parseResult.data) {
        // Not a valid bKash transaction SMS, ignore it
        return;
      }

      const parsed = parseResult.data;

      // Prepare payload for API
      const payload: CreateTransactionPayload = {
        trxId: parsed.transactionId,
        provider: parsed.provider,
        amount: parsed.amount,
        senderNumber: parsed.senderNumber,
        balance: parsed.balance,
        transactionDate: parsed.transactionDate,
        transactionTime: parsed.transactionTime,
        rawSms: parsed.rawSms,
      };

      // Send to backend API
      const result = await apiClient.createTransaction(payload);

      if (result.success) {
        console.log("Transaction saved successfully:", parsed.transactionId);
      } else if (result.duplicate) {
        console.log(
          "Transaction already exists (duplicate):",
          parsed.transactionId
        );
      } else {
        console.error("Failed to save transaction:", result.message);
        // TODO: Implement offline queue for retry when online
      }
    } catch (error) {
      console.error("Error handling SMS:", error);
      // TODO: Implement error handling and retry mechanism
    }
  }

  /**
   * Get listening status
   */
  getListeningStatus(): boolean {
    return this.isListening;
  }
}

export default new SmsListenerService();

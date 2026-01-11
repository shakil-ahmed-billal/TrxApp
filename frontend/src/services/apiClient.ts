/**
 * API Client for Backend Communication
 */

// For Expo, use EXPO_PUBLIC_ prefix for environment variables
// These are available at build time via process.env
const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL) ||
  "http://localhost:8000";
const API_TOKEN =
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_TOKEN) || "";

export interface Transaction {
  id: number;
  trxId: string;
  provider: string;
  amount: number;
  senderNumber: string;
  balance: number;
  transactionDate: string;
  transactionTime: string;
  rawSms: string;
  createdAt: string;
}

export interface CreateTransactionPayload {
  trxId: string;
  provider: string;
  amount: number;
  senderNumber: string;
  balance: number;
  transactionDate: string;
  transactionTime: string;
  rawSms: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
  duplicate?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string = API_BASE_URL, token: string = API_TOKEN) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Request failed",
          error: data.error,
        };
      }

      return data;
    } catch (error: any) {
      console.error("API request error:", error);
      return {
        success: false,
        message: "Network error",
        error: error.message || "Failed to connect to server",
      };
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(
    payload: CreateTransactionPayload
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get all transactions
   */
  async getAllTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.request<Transaction[]>("/api/transactions", {
      method: "GET",
    });
  }

  /**
   * Get transaction by trxId
   */
  async getTransactionByTrxId(
    trxId: string
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/api/transactions/${trxId}`, {
      method: "GET",
    });
  }
}

export default new ApiClient();

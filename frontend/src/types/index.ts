export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  SMS = 'SMS',
  TRANSACTIONS = 'TRANSACTIONS',
  SETTINGS = 'SETTINGS',
}

export interface SMSMessage {
  id: string;
  address: string;
  body: string;
  date: string;
  isRead: boolean;
}

export interface Transaction {
  id: number | string;
  amount: number;
  type?: string;
  recipient?: string;
  trxID?: string;
  trxId?: string;
  timestamp?: string;
  transactionDate?: string;
  transactionTime?: string;
  status?: string;
  provider?: string;
  senderNumber?: string;
  balance?: number;
  rawSms?: string;
  createdAt?: string;
}

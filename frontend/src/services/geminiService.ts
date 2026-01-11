import { Transaction } from '../types';
import apiClient from './apiClient';

/**
 * Placeholder for Gemini AI Service
 * This can be implemented later when Gemini API is integrated
 */
export const analyzeTransactions = async (smsBodies: string[]) => {
  // TODO: Implement Gemini AI integration
  // For now, return empty array
  console.log('analyzeTransactions called with:', smsBodies);
  return [];
};

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  // TODO: Implement Gemini AI integration
  // For now, return placeholder advice
  if (transactions.length === 0) {
    return 'No transactions available to analyze. Once you receive bKash transaction SMS, AI insights will appear here.';
  }

  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const avgAmount = totalAmount / transactions.length;

  return `Based on your ${transactions.length} recent transactions (avg ৳${avgAmount.toFixed(2)}), you're managing your finances well. Tip: Consider setting aside 10% of each transaction for savings.`;
};

/**
 * SMS Parser for bKash Transaction Messages
 * 
 * Sample SMS Format:
 * You have received Tk 380.00 from 01831638032.
 * Fee Tk 0.00.
 * Balance Tk 508.03.
 * TrxID DA72U4603O at 07/01/2026 19:06
 */

export interface ParsedTransaction {
  provider: string;
  amount: number;
  senderNumber: string;
  transactionId: string;
  transactionDate: string;
  transactionTime: string;
  balance: number;
  rawSms: string;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedTransaction;
  error?: string;
}

/**
 * Check if SMS is from bKash and contains transaction data
 */
export function isBkashTransaction(sender: string, body: string): boolean {
  const normalizedSender = sender?.toLowerCase() || "";
  const normalizedBody = body?.toLowerCase() || "";
  
  return normalizedSender.includes("bkash") && normalizedBody.includes("trxid");
}

/**
 * Parse bKash transaction SMS into structured data
 */
export function parseBkashSms(sender: string, body: string): ParseResult {
  try {
    // Check if it's a valid bKash transaction SMS
    if (!isBkashTransaction(sender, body)) {
      return {
        success: false,
        error: "Not a valid bKash transaction SMS",
      };
    }

    // Extract amount - "You have received Tk 380.00 from"
    const amountMatch = body.match(/received\s+Tk\s+([\d,]+\.?\d*)/i);
    if (!amountMatch) {
      return {
        success: false,
        error: "Could not extract amount",
      };
    }
    const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

    // Extract sender number - "from 01831638032."
    const senderMatch = body.match(/from\s+(\d+)/i);
    if (!senderMatch) {
      return {
        success: false,
        error: "Could not extract sender number",
      };
    }
    const senderNumber = senderMatch[1];

    // Extract balance - "Balance Tk 508.03."
    const balanceMatch = body.match(/Balance\s+Tk\s+([\d,]+\.?\d*)/i);
    if (!balanceMatch) {
      return {
        success: false,
        error: "Could not extract balance",
      };
    }
    const balance = parseFloat(balanceMatch[1].replace(/,/g, ""));

    // Extract transaction ID - "TrxID DA72U4603O at"
    const trxIdMatch = body.match(/TrxID\s+(\w+)/i);
    if (!trxIdMatch) {
      return {
        success: false,
        error: "Could not extract transaction ID",
      };
    }
    const transactionId = trxIdMatch[1];

    // Extract date and time - "at 07/01/2026 19:06"
    const dateTimeMatch = body.match(/at\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2})/i);
    if (!dateTimeMatch) {
      return {
        success: false,
        error: "Could not extract date and time",
      };
    }
    const transactionDate = dateTimeMatch[1];
    const transactionTime = dateTimeMatch[2];

    // Validate critical fields
    if (!transactionId || !amount || isNaN(amount)) {
      return {
        success: false,
        error: "Missing critical fields (transaction ID or amount)",
      };
    }

    const parsed: ParsedTransaction = {
      provider: "bKash",
      amount,
      senderNumber,
      transactionId,
      transactionDate,
      transactionTime,
      balance,
      rawSms: body,
    };

    return {
      success: true,
      data: parsed,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to parse SMS",
    };
  }
}


import axios from "axios";
import type {
  StellarActivity,
  HorizonAccountResponse,
  HorizonTransaction,
  HorizonPayment,
} from "../types/index.js";

// ============================================
// Stellar Scanner Service
// ============================================

const HORIZON_URL = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";

/**
 * Validates a Stellar address format
 */
export function isValidStellarAddress(address: string): boolean {
  // Stellar public keys start with 'G' and are 56 characters long
  return /^G[A-Z2-7]{55}$/.test(address);
}

/**
 * Fetches account information from Stellar Horizon API
 */
async function fetchAccount(address: string): Promise<HorizonAccountResponse | null> {
  try {
    const response = await axios.get<HorizonAccountResponse>(
      `${HORIZON_URL}/accounts/${address}`,
      { timeout: 10000 }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // Account not found (not activated yet)
    }
    throw error;
  }
}

/**
 * Fetches transaction history for an account
 */
async function fetchTransactions(address: string, limit = 200): Promise<HorizonTransaction[]> {
  try {
    const response = await axios.get(
      `${HORIZON_URL}/accounts/${address}/transactions`,
      {
        params: { limit, order: "desc" },
        timeout: 15000,
      }
    );
    return response.data._embedded?.records || [];
  } catch (error) {
    console.error("Error fetching Stellar transactions:", error);
    return [];
  }
}

/**
 * Fetches payment operations for an account
 */
async function fetchPayments(address: string, limit = 200): Promise<HorizonPayment[]> {
  try {
    const response = await axios.get(
      `${HORIZON_URL}/accounts/${address}/payments`,
      {
        params: { limit, order: "desc" },
        timeout: 15000,
      }
    );
    return response.data._embedded?.records || [];
  } catch (error) {
    console.error("Error fetching Stellar payments:", error);
    return [];
  }
}

/**
 * Calculate account age in days from the last modified time
 */
function calculateAccountAge(account: HorizonAccountResponse): number {
  if (!account.last_modified_time) return 0;
  const createdAt = new Date(account.last_modified_time);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate total volume from payments
 */
function calculateTotalVolume(payments: HorizonPayment[], address: string): number {
  return payments.reduce((total, payment) => {
    if (payment.type === "payment" || payment.type === "path_payment_strict_receive") {
      const amount = parseFloat(payment.amount) || 0;
      // Only count outgoing payments for volume (to avoid double counting)
      if (payment.from === address) {
        return total + amount;
      }
    }
    return total;
  }, 0);
}

/**
 * Count unique assets held by the account
 */
function countUniqueAssets(account: HorizonAccountResponse): number {
  return account.balances.filter(
    (balance) => parseFloat(balance.balance) > 0
  ).length;
}

/**
 * Calculate Stellar reputation score (0-450)
 * 
 * Scoring breakdown:
 * - Transaction count: 0-100 points (1 point per 10 transactions, max 1000)
 * - Transaction volume: 0-100 points (based on total volume)
 * - Payment count: 0-80 points (activity indicator)
 * - Account age: 0-70 points (1 point per week, max 70)
 * - Asset diversity: 0-50 points (5 points per unique asset, max 10)
 * - Liquidity provision: 0-50 points (bonus for LP participation)
 */
function calculateStellarScore(activity: Omit<StellarActivity, "score">): number {
  let score = 0;

  // Transaction count score (0-100)
  const txScore = Math.min(100, Math.floor(activity.transactionCount / 10));
  score += txScore;

  // Volume score (0-100)
  // Logarithmic scale: 100 XLM = 20 points, 1000 = 40, 10000 = 60, 100000 = 80, 1000000 = 100
  if (activity.totalVolume > 0) {
    const volumeScore = Math.min(100, Math.floor(Math.log10(activity.totalVolume) * 20));
    score += volumeScore;
  }

  // Payment count score (0-80)
  const paymentScore = Math.min(80, Math.floor(activity.paymentCount / 5));
  score += paymentScore;

  // Account age score (0-70)
  const ageScore = Math.min(70, Math.floor(activity.accountAge / 7));
  score += ageScore;

  // Asset diversity score (0-50)
  const diversityScore = Math.min(50, activity.assetDiversity * 5);
  score += diversityScore;

  // Liquidity provision score (0-50)
  if (activity.liquidityProvided > 0) {
    const lpScore = Math.min(50, Math.floor(Math.log10(activity.liquidityProvided) * 10));
    score += lpScore;
  }

  // Ensure score is within bounds
  return Math.min(450, Math.max(0, score));
}

/**
 * Main function to scan Stellar blockchain activity for an address
 */
export async function scanStellarActivity(address: string): Promise<StellarActivity> {
  // Validate address
  if (!isValidStellarAddress(address)) {
    throw new Error("Invalid Stellar address format");
  }

  console.log(`[Stellar Scanner] Scanning address: ${address}`);

  // Fetch account data
  const account = await fetchAccount(address);
  
  if (!account) {
    // Return empty activity for non-activated accounts
    console.log(`[Stellar Scanner] Account not found or not activated: ${address}`);
    return {
      address,
      transactionCount: 0,
      totalVolume: 0,
      liquidityProvided: 0,
      accountAge: 0,
      assetDiversity: 0,
      paymentCount: 0,
      score: 0,
    };
  }

  // Fetch transaction and payment history in parallel
  const [transactions, payments] = await Promise.all([
    fetchTransactions(address),
    fetchPayments(address),
  ]);

  // Calculate activity metrics
  const accountAge = calculateAccountAge(account);
  const totalVolume = calculateTotalVolume(payments, address);
  const assetDiversity = countUniqueAssets(account);
  const paymentCount = payments.filter(
    (p) => p.type === "payment" || p.type === "path_payment_strict_receive"
  ).length;

  // Check for liquidity pool participation
  // (simplified - in production, would check LP operations)
  const liquidityProvided = 0; // TODO: Implement LP detection

  const activityData: Omit<StellarActivity, "score"> = {
    address,
    transactionCount: transactions.length,
    totalVolume,
    liquidityProvided,
    accountAge,
    assetDiversity,
    paymentCount,
  };

  const score = calculateStellarScore(activityData);

  console.log(`[Stellar Scanner] Completed scan for ${address}:`, {
    transactions: transactions.length,
    payments: paymentCount,
    volume: totalVolume.toFixed(2),
    age: accountAge,
    score,
  });

  return {
    ...activityData,
    score,
  };
}

export default {
  scanStellarActivity,
  isValidStellarAddress,
};

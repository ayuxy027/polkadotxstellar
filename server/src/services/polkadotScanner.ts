import axios from "axios";
import type { PolkadotActivity } from "../types/index.js";

// ============================================
// Polkadot Scanner Service
// ============================================

// Subscan API endpoint for Polkadot
const SUBSCAN_API = "https://polkadot.api.subscan.io";
const SUBSCAN_API_KEY = process.env.SUBSCAN_API_KEY || "";

/**
 * Validates a Polkadot address format (SS58 encoding)
 * Polkadot addresses start with '1' and are typically 47-48 characters
 * Kusama addresses start with uppercase letters
 * Generic substrate addresses can start with '5'
 */
export function isValidPolkadotAddress(address: string): boolean {
  // Basic SS58 validation - starts with valid prefix and has correct length
  return /^[1-9A-HJ-NP-Za-km-z]{47,48}$/.test(address);
}

/**
 * Make a request to Subscan API
 */
async function subscanRequest<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (SUBSCAN_API_KEY) {
      headers["X-API-Key"] = SUBSCAN_API_KEY;
    }

    const response = await axios.post<{ code: number; data: T }>(
      `${SUBSCAN_API}${endpoint}`,
      body,
      { headers, timeout: 15000 }
    );

    if (response.data.code !== 0) {
      console.warn(`[Polkadot Scanner] API error for ${endpoint}:`, response.data);
      return null;
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[Polkadot Scanner] Request failed for ${endpoint}:`, error.message);
    }
    return null;
  }
}

/**
 * Fetch account information from Subscan
 */
interface AccountInfo {
  address: string;
  balance: string;
  lock: string;
  balance_lock: string;
  bonded: string;
  reserved: string;
  democracy_lock: string;
  conviction_lock: string;
  election_lock: string;
  nonce: number;
  account_display?: {
    address: string;
    display?: string;
    judgements?: Array<{
      index: number;
      judgement: string;
    }>;
    identity?: boolean;
  };
}

async function fetchAccountInfo(address: string): Promise<AccountInfo | null> {
  return subscanRequest<AccountInfo>("/api/v2/scan/search", { key: address });
}

/**
 * Fetch staking info
 */
interface StakingInfo {
  bonded_owner: string;
  controller: string;
  controller_display?: { address: string };
  reward_account: string;
  stash: string;
  stash_display?: { address: string };
}

async function fetchStakingInfo(address: string): Promise<StakingInfo | null> {
  return subscanRequest<StakingInfo>("/api/scan/staking/validator", { 
    stash: address 
  });
}

/**
 * Fetch nominations (staking delegations)
 */
interface NominatorInfo {
  rank_nominator: number;
  bonded: string;
  targets: string[];
}

async function fetchNominatorInfo(address: string): Promise<NominatorInfo | null> {
  const result = await subscanRequest<{ info: NominatorInfo }>("/api/scan/staking/nominator", {
    address,
  });
  return result?.info || null;
}

/**
 * Fetch governance/democracy votes
 */
interface VoteInfo {
  count: number;
  list: Array<{
    referendum_index: number;
    account: string;
    amount: string;
    conviction: number;
    passed: boolean;
  }>;
}

async function fetchVotes(address: string): Promise<VoteInfo | null> {
  return subscanRequest<VoteInfo>("/api/scan/democracy/votes", {
    address,
    row: 100,
    page: 0,
  });
}

/**
 * Fetch transfer history to estimate activity
 */
interface TransferList {
  count: number;
  transfers: Array<{
    from: string;
    to: string;
    success: boolean;
    hash: string;
    block_num: number;
    block_timestamp: number;
    amount: string;
  }>;
}

async function fetchTransfers(address: string): Promise<TransferList | null> {
  return subscanRequest<TransferList>("/api/v2/scan/transfers", {
    address,
    row: 100,
    page: 0,
  });
}

/**
 * Fetch extrinsics count for activity measurement
 */
interface ExtrinsicCount {
  count: number;
}

async function fetchExtrinsicCount(address: string): Promise<number> {
  const result = await subscanRequest<ExtrinsicCount>("/api/v2/scan/extrinsics", {
    address,
    row: 1,
    page: 0,
  });
  return result?.count || 0;
}

/**
 * Calculate account age from first activity
 */
async function calculateAccountAge(address: string): Promise<number> {
  // Try to get the first extrinsic to determine account age
  const result = await subscanRequest<{ extrinsics: Array<{ block_timestamp: number }> }>(
    "/api/v2/scan/extrinsics",
    {
      address,
      row: 1,
      page: 0,
      order: "asc", // Get oldest first
    }
  );

  if (result?.extrinsics?.[0]?.block_timestamp) {
    const firstActivity = new Date(result.extrinsics[0].block_timestamp * 1000);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - firstActivity.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  return 0;
}

/**
 * Check if account has verified identity
 */
function hasVerifiedIdentity(accountInfo: AccountInfo | null): boolean {
  if (!accountInfo?.account_display?.judgements) return false;
  
  // Check for positive judgements (Reasonable, KnownGood)
  return accountInfo.account_display.judgements.some(
    (j) => j.judgement === "Reasonable" || j.judgement === "KnownGood"
  );
}

/**
 * Calculate Polkadot reputation score (0-550)
 * 
 * Scoring breakdown:
 * - Governance votes: 0-150 points (10 points per vote, max 15)
 * - Staking amount: 0-120 points (logarithmic scale)
 * - Staking duration: 0-80 points (1 point per week)
 * - Validator nominations: 0-50 points (10 points per nomination)
 * - Account age: 0-80 points (1 point per week, max 80)
 * - Identity verified: 0-70 points (bonus for on-chain identity)
 */
function calculatePolkadotScore(activity: Omit<PolkadotActivity, "score">): number {
  let score = 0;

  // Governance participation score (0-150)
  const govScore = Math.min(150, activity.governanceVotes * 10);
  score += govScore;

  // Staking amount score (0-120)
  // Logarithmic: 10 DOT = 20, 100 = 40, 1000 = 60, 10000 = 80, 100000 = 100, 1000000 = 120
  if (activity.stakingAmount > 0) {
    const stakingScore = Math.min(120, Math.floor(Math.log10(activity.stakingAmount) * 20));
    score += stakingScore;
  }

  // Staking duration score (0-80)
  const durationScore = Math.min(80, Math.floor(activity.stakingDuration / 7));
  score += durationScore;

  // Validator nominations score (0-50)
  const nominationsScore = Math.min(50, activity.validatorNominations * 10);
  score += nominationsScore;

  // Account age score (0-80)
  const ageScore = Math.min(80, Math.floor(activity.accountAge / 7));
  score += ageScore;

  // Identity verified bonus (0-70)
  if (activity.identityVerified) {
    score += 70;
  }

  // Ensure score is within bounds
  return Math.min(550, Math.max(0, score));
}

/**
 * Main function to scan Polkadot blockchain activity for an address
 */
export async function scanPolkadotActivity(address: string): Promise<PolkadotActivity> {
  // Validate address
  if (!isValidPolkadotAddress(address)) {
    throw new Error("Invalid Polkadot address format");
  }

  console.log(`[Polkadot Scanner] Scanning address: ${address}`);

  // Fetch all data in parallel for efficiency
  const [accountInfo, nominatorInfo, votes, accountAge, extrinsicCount] = await Promise.all([
    fetchAccountInfo(address),
    fetchNominatorInfo(address),
    fetchVotes(address),
    calculateAccountAge(address),
    fetchExtrinsicCount(address),
  ]);

  // Parse staking amount from nominator info
  const stakingAmount = nominatorInfo?.bonded
    ? parseFloat(nominatorInfo.bonded) / 1e10 // Convert Planck to DOT
    : 0;

  // Count validator nominations
  const validatorNominations = nominatorInfo?.targets?.length || 0;

  // Get governance votes count
  const governanceVotes = votes?.count || 0;

  // Check for verified identity
  const identityVerified = hasVerifiedIdentity(accountInfo);

  // Estimate staking duration (simplified - would need historical data for accuracy)
  // For now, use account age as proxy if staking
  const stakingDuration = stakingAmount > 0 ? accountAge : 0;

  // Parachain interactions (estimated from extrinsic count - simplified)
  const parachainInteractions = Math.floor(extrinsicCount / 10);

  const activityData: Omit<PolkadotActivity, "score"> = {
    address,
    governanceVotes,
    stakingAmount,
    stakingDuration,
    validatorNominations,
    parachainInteractions,
    accountAge,
    identityVerified,
  };

  const score = calculatePolkadotScore(activityData);

  console.log(`[Polkadot Scanner] Completed scan for ${address}:`, {
    votes: governanceVotes,
    staked: stakingAmount.toFixed(2),
    nominations: validatorNominations,
    age: accountAge,
    identity: identityVerified,
    score,
  });

  return {
    ...activityData,
    score,
  };
}

export default {
  scanPolkadotActivity,
  isValidPolkadotAddress,
};

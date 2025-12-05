// ============================================
// Request/Response Types
// ============================================

export interface ScanRequest {
  stellarAddress: string;
  polkadotAddress: string;
}

export interface ScanResponse {
  success: boolean;
  data?: ReputationData;
  error?: string;
}

// ============================================
// Reputation Data Types
// ============================================

export interface ReputationData {
  overallScore: number; // 0-1000
  profile: ReputationProfile;
  stellar: StellarActivity;
  polkadot: PolkadotActivity;
  breakdown: ScoreBreakdown;
  aiInsights: AIInsights;
  timestamp: number;
}

export type ReputationProfile = 
  | "Trader"
  | "Governor"
  | "Staker"
  | "Liquidity Provider"
  | "Balanced"
  | "Newcomer";

// ============================================
// Blockchain Activity Types
// ============================================

export interface StellarActivity {
  address: string;
  transactionCount: number;
  totalVolume: number; // In XLM
  liquidityProvided: number; // In XLM
  accountAge: number; // Days
  assetDiversity: number; // Number of unique assets
  paymentCount: number;
  score: number; // 0-450
}

export interface PolkadotActivity {
  address: string;
  governanceVotes: number;
  stakingAmount: number; // In DOT
  stakingDuration: number; // Days
  validatorNominations: number;
  parachainInteractions: number;
  accountAge: number; // Days
  identityVerified: boolean;
  score: number; // 0-550
}

// ============================================
// Score Breakdown
// ============================================

export interface ScoreBreakdown {
  transactionConsistency: number; // 0-200
  governanceParticipation: number; // 0-250
  stakingBehavior: number; // 0-200
  liquidityProvision: number; // 0-150
  accountAge: number; // 0-100
  assetDiversity: number; // 0-100
}

// ============================================
// AI Insights
// ============================================

export interface AIInsights {
  profile: ReputationProfile;
  confidence: number; // 0-100
  summary: string;
  strengths: string[];
  recommendations: string[];
  redFlags: string[];
}

// ============================================
// API Response Types from External Services
// ============================================

// Stellar Horizon API Response Types
export interface HorizonAccountResponse {
  id: string;
  account_id: string;
  sequence: string;
  balances: HorizonBalance[];
  signers: HorizonSigner[];
  data: Record<string, string>;
  last_modified_time: string;
}

export interface HorizonBalance {
  balance: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
}

export interface HorizonSigner {
  key: string;
  type: string;
  weight: number;
}

export interface HorizonTransaction {
  id: string;
  successful: boolean;
  created_at: string;
  source_account: string;
  fee_charged: string;
  operation_count: number;
}

export interface HorizonPayment {
  id: string;
  type: string;
  created_at: string;
  from: string;
  to: string;
  amount: string;
  asset_type: string;
  asset_code?: string;
}

// Subscan API Response Types (for Polkadot)
export interface SubscanAccountInfo {
  address: string;
  balance: string;
  lock: string;
  reserved: string;
  nonce: number;
}

export interface SubscanTransfer {
  from: string;
  to: string;
  success: boolean;
  hash: string;
  block_num: number;
  block_timestamp: number;
  amount: string;
}

export interface SubscanStakingInfo {
  controller: string;
  stash: string;
  bonded: string;
  active: string;
  unlocking: Array<{
    value: string;
    era: number;
  }>;
}

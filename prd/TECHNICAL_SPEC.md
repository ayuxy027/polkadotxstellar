# Technical Specification: ChainRepute

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Wallet     │  │  Reputation  │  │  Credential  │      │
│  │  Connection  │  │   Dashboard  │  │    Minting   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (AI Agent)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Stellar    │  │   Polkadot   │  │      AI      │      │
│  │   Scanner    │  │   Scanner    │  │    Engine    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Stellar Blockchain     │  │  Polkadot Blockchain     │
│  ┌──────────────────┐    │  │  ┌──────────────────┐    │
│  │ Soroban Contract │    │  │  │  Ink! Contract   │    │
│  │ (Reputation Data)│    │  │  │  (SBT Minting)   │    │
│  └──────────────────┘    │  │  └──────────────────┘    │
└──────────────────────────┘  └──────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** React 18.2+
- **Build Tool:** Vite 5.0+
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4+
- **State Management:** Zustand or React Context
- **HTTP Client:** Axios
- **Wallet Libraries:**
  - `@stellar/freighter-api` - Stellar wallet connection
  - `@polkadot/extension-dapp` - Polkadot wallet connection
  - `@polkadot/api` - Polkadot blockchain interaction
- **Stellar SDK:** `@stellar/stellar-sdk`
- **UI Components:** Headless UI or Radix UI
- **Icons:** Lucide React or Heroicons
- **Animations:** Framer Motion (optional)

### Backend (AI Agent)
- **Runtime:** Node.js 18+ or Python 3.10+
- **Framework:** Express.js (Node) or FastAPI (Python)
- **AI Provider:** OpenAI API or Groq API
- **Blockchain APIs:**
  - Stellar Horizon API (https://horizon-testnet.stellar.org)
  - Subscan API (https://polkadot.api.subscan.io)
  - Polkadot.js API
- **Environment:** dotenv for configuration
- **CORS:** cors middleware for cross-origin requests

### Smart Contracts

#### Stellar (Soroban)
- **Language:** Rust
- **SDK:** soroban-sdk
- **Network:** Futurenet (Soroban testnet)
- **Deployment:** soroban-cli

#### Polkadot (Ink!)
- **Language:** Rust
- **Framework:** ink! 4.0+
- **Network:** Contracts parachain on Rococo/Westend
- **Deployment:** cargo-contract

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm/yarn/pnpm
- **Code Editor:** VS Code
- **Testing:** Vitest (frontend), Jest (backend)
- **Linting:** ESLint, Prettier
- **Type Checking:** TypeScript strict mode

## Component Specifications

### 1. Frontend Components

#### A. WalletConnect Component
**Purpose:** Connect and manage Stellar and Polkadot wallets

**Features:**
- Detect installed wallet extensions
- Connect Stellar wallet (Freighter)
- Connect Polkadot wallet (Polkadot.js, Talisman, SubWallet)
- Display connected addresses
- Handle wallet disconnection
- Show connection status

**State:**
```typescript
interface WalletState {
  stellar: {
    address: string | null;
    connected: boolean;
    publicKey: string | null;
  };
  polkadot: {
    address: string | null;
    connected: boolean;
    account: InjectedAccountWithMeta | null;
  };
}
```

**Key Functions:**
- `connectStellar()` - Initiate Freighter connection
- `connectPolkadot()` - Initiate Polkadot.js connection
- `disconnectWallets()` - Clear wallet connections
- `checkWalletExtensions()` - Verify installed extensions

#### B. ReputationScanner Component
**Purpose:** Trigger and display activity scanning process

**Features:**
- Initiate blockchain scanning
- Show loading state with progress
- Display scanning results
- Handle errors gracefully

**API Integration:**
```typescript
interface ScanRequest {
  stellarAddress: string;
  polkadotAddress: string;
}

interface ScanResponse {
  stellarActivity: StellarActivity;
  polkadotActivity: PolkadotActivity;
  reputationScore: number;
  profile: string;
  breakdown: ScoreBreakdown;
}
```

**Key Functions:**
- `scanActivity()` - Call backend API to scan both chains
- `displayResults()` - Render activity breakdown
- `calculateProgress()` - Show scanning progress

#### C. ReputationDashboard Component
**Purpose:** Display unified reputation score and activity breakdown

**Features:**
- Overall reputation score (0-1000)
- Score visualization (progress bar, gauge)
- Stellar activity breakdown
- Polkadot activity breakdown
- Reputation profile badge
- Historical data (if available)

**Data Structure:**
```typescript
interface ReputationData {
  overallScore: number; // 0-1000
  profile: 'Trader' | 'Governor' | 'Staker' | 'Liquidity Provider' | 'Balanced';
  stellar: {
    transactionCount: number;
    totalVolume: number;
    liquidityProvided: number;
    accountAge: number;
    assetDiversity: number;
    score: number;
  };
  polkadot: {
    governanceVotes: number;
    stakingAmount: number;
    stakingDuration: number;
    validatorNominations: number;
    parachainInteractions: number;
    accountAge: number;
    score: number;
  };
  breakdown: {
    transactionConsistency: number; // 20%
    governanceParticipation: number; // 25%
    stakingBehavior: number; // 20%
    liquidityProvision: number; // 15%
    accountAge: number; // 10%
    assetDiversity: number; // 10%
  };
}
```

#### D. CredentialMinting Component
**Purpose:** Mint cross-chain reputation credentials

**Features:**
- Mint button with loading state
- Transaction signing for both chains
- Progress tracking (Stellar → Polkadot)
- Success/error notifications
- Display minted credential details

**Flow:**
1. User clicks "Mint Credential"
2. Call Stellar contract to store reputation
3. Wait for Stellar transaction confirmation
4. Call Polkadot contract to mint SBT
5. Wait for Polkadot transaction confirmation
6. Display success with transaction hashes

**Key Functions:**
- `mintOnStellar()` - Store reputation data on Stellar
- `mintOnPolkadot()` - Mint SBT on Polkadot
- `verifyCredential()` - Check credential status on both chains

#### E. UseCaseDemo Component
**Purpose:** Demonstrate reputation-based use cases

**Features:**
- Undercollateralized loan calculator
- DAO voting power display
- Community access gates
- Interactive examples

**Examples:**
```typescript
// Loan Calculator
function calculateCollateral(reputationScore: number, loanAmount: number): number {
  const baseCollateral = loanAmount * 1.5; // 150% default
  const reputationDiscount = (reputationScore / 1000) * 0.5; // Up to 50% reduction
  return baseCollateral * (1 - reputationDiscount);
}

// Voting Power
function calculateVotingPower(reputationScore: number, baseVotes: number): number {
  const multiplier = 1 + (reputationScore / 1000); // 1x to 2x
  return baseVotes * multiplier;
}
```

### 2. Backend (AI Agent) Specifications

#### A. Stellar Scanner Module

**Purpose:** Fetch and analyze Stellar blockchain activity

**API Endpoint:** Stellar Horizon API
- Base URL: `https://horizon-testnet.stellar.org`
- Documentation: https://developers.stellar.org/api/horizon

**Data to Fetch:**
```typescript
interface StellarActivity {
  address: string;
  accountAge: number; // Days since account creation
  transactionCount: number;
  totalVolume: number; // Total XLM/USDC transacted
  liquidityPools: {
    poolId: string;
    liquidityProvided: number;
    duration: number;
  }[];
  assetHoldings: {
    assetCode: string;
    balance: number;
  }[];
  paymentPatterns: {
    frequency: number; // Transactions per month
    consistency: number; // Regularity score
  };
}
```

**Key Functions:**
```typescript
async function fetchStellarAccount(address: string): Promise<AccountResponse>
async function fetchTransactionHistory(address: string): Promise<Transaction[]>
async function analyzeLiquidityPools(address: string): Promise<LiquidityPool[]>
async function calculateStellarScore(activity: StellarActivity): Promise<number>
```

**Scoring Logic:**
- Transaction count: 0-200 points (1 point per 10 transactions, max 2000)
- Transaction volume: 0-150 points (based on total volume)
- Liquidity provision: 0-150 points (based on LP participation)
- Account age: 0-100 points (1 point per month, max 100)
- Asset diversity: 0-100 points (10 points per unique asset, max 10)
- Payment consistency: 0-200 points (regular activity bonus)

**Total Stellar Score:** 0-900 points (normalized to 0-450 for overall score)

#### B. Polkadot Scanner Module

**Purpose:** Fetch and analyze Polkadot blockchain activity

**API Options:**
1. Subscan API: `https://polkadot.api.subscan.io`
2. Polkadot.js API: Direct node connection

**Data to Fetch:**
```typescript
interface PolkadotActivity {
  address: string;
  accountAge: number; // Days since first transaction
  governanceVotes: number;
  votingPower: number;
  stakingAmount: number; // DOT staked
  stakingDuration: number; // Days staked
  validatorNominations: number;
  parachainInteractions: {
    parachainId: number;
    interactionCount: number;
  }[];
  slashingHistory: number; // Penalty for slashing events
}
```

**Key Functions:**
```typescript
async function fetchPolkadotAccount(address: string): Promise<AccountInfo>
async function fetchGovernanceActivity(address: string): Promise<GovernanceVote[]>
async function fetchStakingInfo(address: string): Promise<StakingInfo>
async function calculatePolkadotScore(activity: PolkadotActivity): Promise<number>
```

**Scoring Logic:**
- Governance votes: 0-250 points (10 points per vote, max 25 votes)
- Staking amount: 0-200 points (based on DOT staked)
- Staking duration: 0-200 points (1 point per week, max 200)
- Validator nominations: 0-100 points (quality of validators)
- Parachain interactions: 0-100 points (ecosystem participation)
- Account age: 0-100 points (1 point per month, max 100)
- Slashing penalty: -50 to 0 points (deduct for bad behavior)

**Total Polkadot Score:** 0-950 points (normalized to 0-550 for overall score)

#### C. AI Reputation Engine

**Purpose:** Analyze behavior patterns and generate reputation scores

**AI Provider:** OpenAI GPT-4 or Groq (Llama 3)

**Input:**
```typescript
interface AIAnalysisInput {
  stellarActivity: StellarActivity;
  polkadotActivity: PolkadotActivity;
  rawScores: {
    stellar: number;
    polkadot: number;
  };
}
```

**AI Prompt Template:**
```
Analyze the following cross-chain blockchain activity and provide insights:

Stellar Activity:
- Transactions: {transactionCount}
- Volume: {totalVolume} XLM
- Liquidity Pools: {liquidityPools.length}
- Account Age: {accountAge} days

Polkadot Activity:
- Governance Votes: {governanceVotes}
- Staking: {stakingAmount} DOT for {stakingDuration} days
- Validator Nominations: {validatorNominations}

Based on this activity:
1. Assign a reputation profile (Trader, Governor, Staker, Liquidity Provider, or Balanced)
2. Identify any red flags or exceptional behavior
3. Provide a confidence score for the reputation assessment

Return JSON format:
{
  "profile": "string",
  "confidence": number,
  "insights": "string",
  "redFlags": string[]
}
```

**Output:**
```typescript
interface AIAnalysisOutput {
  profile: string;
  confidence: number; // 0-100
  insights: string;
  redFlags: string[];
  adjustedScore: number; // AI-adjusted final score
}
```

**Final Score Calculation:**
```typescript
function calculateFinalScore(
  stellarScore: number,
  polkadotScore: number,
  aiAdjustment: number
): number {
  const baseScore = stellarScore + polkadotScore; // 0-1000
  const aiBonus = aiAdjustment * 0.1; // AI can add/subtract up to 10%
  return Math.min(1000, Math.max(0, baseScore + aiBonus));
}
```

#### D. API Endpoints

**Base URL:** `http://localhost:3000/api` (development)

**Endpoints:**

1. **POST /scan**
   - Request: `{ stellarAddress: string, polkadotAddress: string }`
   - Response: `ReputationData`
   - Description: Scan both chains and return reputation data

2. **GET /reputation/:stellarAddress/:polkadotAddress**
   - Response: `ReputationData`
   - Description: Get cached reputation data (if available)

3. **POST /verify-credential**
   - Request: `{ stellarAddress: string, polkadotAddress: string }`
   - Response: `{ verified: boolean, stellar: boolean, polkadot: boolean }`
   - Description: Verify credential exists on both chains

4. **GET /health**
   - Response: `{ status: 'ok', timestamp: number }`
   - Description: Health check endpoint

### 3. Smart Contract Specifications

#### A. Stellar Soroban Contract

**Contract Name:** `ReputationRegistry`

**Storage:**
```rust
pub struct ReputationData {
    pub score: u32,           // 0-1000
    pub profile: String,      // "Trader", "Governor", etc.
    pub timestamp: u64,       // Unix timestamp
    pub polkadot_address: String, // Linked Polkadot address
}

// Map: Stellar Address -> ReputationData
pub reputation_map: Map<Address, ReputationData>
```

**Functions:**
```rust
// Store or update reputation
pub fn store_reputation(
    env: Env,
    user: Address,
    score: u32,
    profile: String,
    polkadot_address: String
) -> Result<(), Error>

// Get reputation data
pub fn get_reputation(
    env: Env,
    user: Address
) -> Result<ReputationData, Error>

// Verify credential exists
pub fn verify_credential(
    env: Env,
    user: Address
) -> bool

// Update score (only by authorized updater)
pub fn update_score(
    env: Env,
    user: Address,
    new_score: u32
) -> Result<(), Error>
```

**Events:**
```rust
pub enum Event {
    ReputationStored {
        user: Address,
        score: u32,
        timestamp: u64,
    },
    ReputationUpdated {
        user: Address,
        old_score: u32,
        new_score: u32,
    },
}
```

**Deployment:**
```bash
# Build contract
soroban contract build

# Deploy to Futurenet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/reputation_registry.wasm \
  --network futurenet

# Initialize contract
soroban contract invoke \
  --id <CONTRACT_ID> \
  --network futurenet \
  -- initialize
```

#### B. Polkadot Ink! Contract

**Contract Name:** `ReputationSBT`

**Storage:**
```rust
#[ink(storage)]
pub struct ReputationSBT {
    /// Mapping from account to reputation data
    reputation_data: Mapping<AccountId, ReputationData>,
    /// Total SBTs minted
    total_supply: u64,
    /// Contract owner
    owner: AccountId,
}

pub struct ReputationData {
    pub score: u32,
    pub profile: String,
    pub stellar_address: String,
    pub minted_at: u64,
    pub token_id: u64,
}
```

**Functions:**
```rust
// Mint SBT (non-transferable)
#[ink(message)]
pub fn mint_sbt(
    &mut self,
    score: u32,
    profile: String,
    stellar_address: String
) -> Result<u64, Error>

// Get reputation data
#[ink(message)]
pub fn get_reputation(
    &self,
    account: AccountId
) -> Option<ReputationData>

// Verify ownership
#[ink(message)]
pub fn verify_ownership(
    &self,
    account: AccountId
) -> bool

// Update score (only owner can update their own)
#[ink(message)]
pub fn update_score(
    &mut self,
    new_score: u32
) -> Result<(), Error>

// IMPORTANT: No transfer function (Soulbound)
// Attempting to transfer should fail
```

**Events:**
```rust
#[ink(event)]
pub struct SBTMinted {
    #[ink(topic)]
    owner: AccountId,
    token_id: u64,
    score: u32,
}

#[ink(event)]
pub struct ScoreUpdated {
    #[ink(topic)]
    owner: AccountId,
    old_score: u32,
    new_score: u32,
}
```

**Deployment:**
```bash
# Build contract
cargo contract build --release

# Deploy to Contracts parachain (Rococo)
cargo contract instantiate \
  --constructor new \
  --args <OWNER_ADDRESS> \
  --suri //Alice \
  --url wss://rococo-contracts-rpc.polkadot.io

# Upload and instantiate via Contracts UI
# https://contracts-ui.substrate.io/
```

## Data Flow Diagram

### Complete User Journey

```
1. User Action: Connect Wallets
   ↓
   Frontend: WalletConnect Component
   ↓
   Stellar: Freighter API → Get Public Key
   Polkadot: Polkadot.js Extension → Get Account
   ↓
   Frontend: Display Connected Addresses

2. User Action: Scan Activity
   ↓
   Frontend: Call Backend API
   ↓
   Backend: Stellar Scanner
   ├─→ Horizon API: Fetch Account Data
   ├─→ Horizon API: Fetch Transactions
   ├─→ Horizon API: Fetch Liquidity Pools
   └─→ Calculate Stellar Score
   ↓
   Backend: Polkadot Scanner
   ├─→ Subscan API: Fetch Account Info
   ├─→ Subscan API: Fetch Governance Votes
   ├─→ Subscan API: Fetch Staking Info
   └─→ Calculate Polkadot Score
   ↓
   Backend: AI Engine
   ├─→ OpenAI/Groq: Analyze Patterns
   ├─→ Generate Profile
   └─→ Calculate Final Score
   ↓
   Backend: Return ReputationData
   ↓
   Frontend: Display Dashboard

3. User Action: Mint Credential
   ↓
   Frontend: Call Stellar Contract
   ├─→ Freighter: Sign Transaction
   ├─→ Soroban Contract: store_reputation()
   └─→ Wait for Confirmation
   ↓
   Frontend: Call Polkadot Contract
   ├─→ Polkadot.js: Sign Transaction
   ├─→ Ink! Contract: mint_sbt()
   └─→ Wait for Confirmation
   ↓
   Frontend: Display Success + Credential Details

4. User Action: Verify Credential
   ↓
   Frontend: Query Both Chains
   ├─→ Stellar Contract: get_reputation()
   └─→ Polkadot Contract: get_reputation()
   ↓
   Frontend: Display Verification Status
```

## Environment Configuration

### Frontend (.env)
```bash
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_STELLAR_CONTRACT_ID=<DEPLOYED_CONTRACT_ID>

VITE_POLKADOT_NETWORK=rococo
VITE_POLKADOT_RPC_URL=wss://rococo-contracts-rpc.polkadot.io
VITE_POLKADOT_CONTRACT_ADDRESS=<DEPLOYED_CONTRACT_ADDRESS>

VITE_BACKEND_API_URL=http://localhost:3000/api
```

### Backend (.env)
```bash
PORT=3000
NODE_ENV=development

# AI Provider
OPENAI_API_KEY=<YOUR_OPENAI_KEY>
# OR
GROQ_API_KEY=<YOUR_GROQ_KEY>

# Blockchain APIs
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
SUBSCAN_API_KEY=<YOUR_SUBSCAN_KEY>
POLKADOT_RPC_URL=wss://rococo-contracts-rpc.polkadot.io

# Contract Addresses
STELLAR_CONTRACT_ID=<DEPLOYED_CONTRACT_ID>
POLKADOT_CONTRACT_ADDRESS=<DEPLOYED_CONTRACT_ADDRESS>

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Error Handling

### Frontend Error States
```typescript
enum ErrorType {
  WALLET_NOT_INSTALLED = 'Wallet extension not installed',
  WALLET_CONNECTION_FAILED = 'Failed to connect wallet',
  NETWORK_ERROR = 'Network request failed',
  SCAN_FAILED = 'Failed to scan blockchain activity',
  MINT_FAILED = 'Failed to mint credential',
  INSUFFICIENT_ACTIVITY = 'Insufficient on-chain activity',
  CONTRACT_ERROR = 'Smart contract error',
}
```

### Backend Error Responses
```typescript
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}
```

### Common Error Scenarios
1. **Wallet not installed:** Show installation instructions
2. **Network timeout:** Retry with exponential backoff
3. **Insufficient activity:** Show minimum requirements
4. **Contract call failed:** Display transaction error details
5. **API rate limit:** Queue requests and retry

## Performance Considerations

### Optimization Strategies
1. **Caching:** Cache reputation data for 24 hours
2. **Lazy Loading:** Load components on demand
3. **Debouncing:** Debounce API calls (500ms)
4. **Pagination:** Limit transaction history to last 1000
5. **Parallel Requests:** Fetch Stellar and Polkadot data simultaneously
6. **Memoization:** Cache expensive calculations

### Target Metrics
- Initial page load: <2 seconds
- Wallet connection: <1 second
- Activity scan: <5 seconds
- Credential minting: <10 seconds (both chains)
- Dashboard render: <500ms

## Security Considerations

### Best Practices
1. **Never store private keys** - Always use wallet extensions
2. **Validate all inputs** - Sanitize addresses and user input
3. **Rate limiting** - Prevent API abuse
4. **CORS configuration** - Restrict to known origins
5. **Environment variables** - Never commit secrets
6. **Contract access control** - Only owner can update their reputation
7. **Soulbound tokens** - Prevent SBT transfers

### Audit Checklist
- [ ] No private key handling in code
- [ ] All API endpoints have rate limiting
- [ ] Input validation on all user inputs
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Smart contracts tested for reentrancy
- [ ] No hardcoded secrets in codebase

## Testing Strategy

### Unit Tests
- Reputation calculation logic
- Score normalization functions
- AI prompt generation
- Error handling

### Integration Tests
- Wallet connection flow
- API endpoint responses
- Smart contract interactions
- Cross-chain data consistency

### E2E Tests (Manual for Hackathon)
- Complete user journey
- Wallet connection → Scan → Mint → Verify
- Error scenarios
- Different reputation profiles

### Demo Testing Checklist
- [ ] Both wallets connect successfully
- [ ] Activity scan completes in <5 seconds
- [ ] Reputation score displays correctly
- [ ] Credential mints on both chains
- [ ] Dashboard shows accurate data
- [ ] Use case demos work
- [ ] Error states display properly
- [ ] Mobile responsive (bonus)

## Deployment Plan

### Development (Local)
1. Run backend: `npm run dev` (port 3000)
2. Run frontend: `npm run dev` (port 5173)
3. Deploy contracts to testnets
4. Update environment variables

### Demo Deployment (Hackathon)
1. **Frontend:** Deploy to Vercel/Netlify
2. **Backend:** Deploy to Railway/Render
3. **Contracts:** Already on testnets
4. **Environment:** Update production URLs

### Post-Hackathon (Production)
1. Mainnet contract deployment
2. Production API infrastructure
3. CDN for frontend
4. Database for caching
5. Monitoring and analytics

## API Rate Limits

### Stellar Horizon API
- Rate limit: 3600 requests/hour
- Strategy: Cache responses, batch requests

### Subscan API
- Rate limit: Varies by plan (free tier: 100/day)
- Strategy: Use Polkadot.js API as fallback

### OpenAI API
- Rate limit: Depends on tier
- Strategy: Use Groq for faster, cheaper inference

### Mitigation
- Implement request queuing
- Cache responses for 24 hours
- Use multiple API keys (if needed)
- Fallback to simpler scoring if AI unavailable
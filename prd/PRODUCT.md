# Product Requirements Document: ChainRepute

## Product Name
**ChainRepute** - Cross-Chain Identity & Reputation Protocol

## Tagline
"Your reputation follows you across chains"

## Problem Statement

### The Problem
Web3 users build reputation across multiple blockchains, but this reputation is fragmented and siloed:
- A trusted DeFi user on Stellar has no reputation on Polkadot
- Active governance participants on Polkadot appear as strangers on Stellar
- DAOs can't verify cross-chain contribution history
- Lenders can't assess borrower reputation across ecosystems
- Communities can't identify genuine users vs. bots/sybils

**Result:** Users must rebuild reputation from scratch on every chain, limiting cross-chain opportunities and creating friction.

### Why This Matters
- **DeFi:** Undercollateralized lending requires reputation but can't see cross-chain history
- **DAOs:** Voting power should reflect total ecosystem contribution, not single-chain activity
- **Communities:** Need to verify genuine users across chains
- **Onboarding:** New users with existing reputation elsewhere start from zero

## Solution Overview

### What We're Building
An AI-powered cross-chain identity protocol that:
1. Aggregates user activity from Stellar and Polkadot
2. Analyzes behavior patterns using AI
3. Generates unified reputation scores
4. Issues verifiable cross-chain credentials
5. Enables reputation-based access and privileges

### How It Works

#### User Flow
1. **Connect Wallets**
   - User connects Stellar wallet (Freighter)
   - User connects Polkadot wallet (Polkadot.js, Talisman, SubWallet)

2. **AI Scans Activity**
   - Stellar: Transaction history, payment patterns, liquidity provision, asset holdings
   - Polkadot: Governance votes, staking history, parachain interactions, validator activity

3. **Generate Reputation Score**
   - AI analyzes patterns and behaviors
   - Calculates weighted reputation score (0-1000)
   - Identifies reputation categories (Trader, Governor, Liquidity Provider, etc.)

4. **Issue Credential**
   - Mint Soulbound Token (SBT) on Polkadot
   - Store reputation data on Stellar
   - Create cross-chain verifiable credential

5. **Use Reputation**
   - Access undercollateralized loans
   - Gain voting power in DAOs
   - Join exclusive communities
   - Prove human/non-bot status

## Why Both Chains Are Essential

### Stellar's Role
- **Payment Reputation:** Transaction volume, consistency, payment patterns
- **DeFi Activity:** Liquidity pool participation, asset holdings, trading history
- **Speed & Cost:** Fast, cheap credential verification
- **Asset Issuance:** Native token support for reputation-based assets
- **Data Storage:** Efficient storage of reputation metadata

### Polkadot's Role
- **Governance Reputation:** Voting history, proposal participation, conviction voting
- **Staking Behavior:** Validator selection, staking duration, slashing history
- **Parachain Activity:** Cross-chain interactions, ecosystem participation
- **SBT Issuance:** Non-transferable credential (Soulbound Token)
- **Complex Logic:** Advanced reputation calculations and governance integration

### Cross-Chain Integration
- **Unified Identity:** Single reputation spanning both ecosystems
- **Complementary Data:** Payment behavior (Stellar) + Governance behavior (Polkadot) = Complete picture
- **Mutual Verification:** Both chains validate the credential
- **Interoperable Use Cases:** Reputation earned on one chain unlocks opportunities on the other

## Core Features (MVP)

### 1. Wallet Connection
- Connect Stellar wallet (Freighter)
- Connect Polkadot wallet (Polkadot.js extension)
- Display connected addresses
- Verify wallet ownership

### 2. Activity Scanning
- **Stellar Analysis:**
  - Total transactions count
  - Transaction volume (XLM/USDC)
  - Liquidity pool participation
  - Account age
  - Asset diversity
  
- **Polkadot Analysis:**
  - Governance votes cast
  - Staking amount and duration
  - Validator nominations
  - Parachain interactions
  - Account age

### 3. AI Reputation Engine
- Fetch on-chain data via APIs (Horizon for Stellar, Subscan for Polkadot)
- Analyze behavior patterns
- Calculate weighted scores:
  - Transaction consistency: 20%
  - Governance participation: 25%
  - Staking behavior: 20%
  - Liquidity provision: 15%
  - Account age: 10%
  - Asset diversity: 10%
- Generate overall reputation score (0-1000)
- Identify reputation profile (Trader, Governor, Staker, etc.)

### 4. Credential Issuance
- **Stellar Contract:**
  - Store reputation score
  - Store metadata (timestamp, profile type)
  - Allow score updates
  - Emit events for verification

- **Polkadot Contract:**
  - Mint Soulbound Token (non-transferable NFT)
  - Store reputation score
  - Link to Stellar credential
  - Prevent transfers (soul-bound)

### 5. Reputation Dashboard
- Display unified reputation score
- Show Stellar activity breakdown
- Show Polkadot activity breakdown
- Display reputation profile/category
- Show credential status (minted/not minted)
- Historical score tracking

### 6. Use Case Demonstrations
- **Undercollateralized Loan:** Show how high reputation enables lower collateral
- **DAO Voting Power:** Display reputation-weighted voting
- **Community Access:** Gate content/features by reputation threshold

## Technical Architecture

### Frontend (React + Vite)
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Wallet Integration:**
  - @stellar/freighter-api for Stellar
  - @polkadot/extension-dapp for Polkadot
- **State Management:** React Context or Zustand
- **API Calls:** Axios or Fetch

### Backend (AI Agent)
- **Runtime:** Node.js or Python
- **AI Integration:** Groq API or OpenAI (for comparison)
- **Blockchain APIs:**
  - Stellar Horizon API
  - Subscan API or Polkadot.js API
- **Functions:**
  - Fetch on-chain data
  - Calculate reputation scores
  - Generate insights
  - Trigger credential minting

### Smart Contracts

#### Stellar (Soroban - Rust)
```
Contract: ReputationRegistry
Functions:
- store_reputation(user: Address, score: u32, metadata: String)
- get_reputation(user: Address) -> (u32, String)
- update_reputation(user: Address, new_score: u32)
- verify_credential(user: Address) -> bool
```

#### Polkadot (Ink! - Rust)
```
Contract: ReputationSBT
Functions:
- mint_sbt(score: u32, stellar_address: String)
- get_reputation(account: AccountId) -> u32
- verify_ownership(account: AccountId) -> bool
- update_score(new_score: u32)
```

### Data Flow
1. User connects wallets → Frontend
2. Frontend requests scan → Backend AI Agent
3. AI Agent fetches data → Stellar Horizon API + Polkadot Subscan API
4. AI Agent calculates score → Returns to Frontend
5. User mints credential → Frontend calls both smart contracts
6. Stellar contract stores data → Emits event
7. Polkadot contract mints SBT → Non-transferable NFT created
8. Dashboard displays unified reputation → User can use credential

## User Stories

### Primary Users

#### 1. DeFi User (Sarah)
- **Goal:** Get undercollateralized loan based on reputation
- **Journey:**
  - Connects Stellar + Polkadot wallets
  - AI scans 2 years of DeFi activity
  - Score: 850/1000 (High reputation)
  - Mints credential
  - Applies for loan with 50% collateral instead of 150%
  - Gets approved based on reputation

#### 2. DAO Contributor (Alex)
- **Goal:** Gain voting power across chains
- **Journey:**
  - Active governance participant on Polkadot
  - Also provides liquidity on Stellar
  - Connects both wallets
  - Score: 720/1000 (Governor profile)
  - Joins new DAO on Stellar
  - Gets 2x voting power due to proven governance history

#### 3. New User (Maria)
- **Goal:** Prove she's not a bot/sybil
- **Journey:**
  - Has 6 months of activity on Stellar
  - Wants to join Polkadot community
  - Connects wallets
  - Score: 450/1000 (Moderate reputation)
  - Gains access to community features
  - Doesn't need to rebuild reputation from scratch

## Success Metrics

### Demo Metrics
- Successfully scan real wallet addresses
- Generate accurate reputation scores
- Mint credentials on both chains
- Display unified dashboard
- Complete end-to-end flow in <2 minutes

### Technical Metrics
- API response time <3 seconds
- Reputation calculation accuracy
- Smart contract deployment success
- Cross-chain data consistency
- Zero failed transactions in demo

## Out of Scope (For Hackathon)

### Not Building (Yet)
- ❌ Full production deployment
- ❌ Multiple chain support beyond Stellar + Polkadot
- ❌ Reputation marketplace
- ❌ Advanced AI models (use simple scoring for MVP)
- ❌ Mobile app
- ❌ Reputation staking/delegation
- ❌ Privacy features (zero-knowledge proofs)
- ❌ Reputation decay over time
- ❌ Dispute resolution mechanism

### Future Enhancements
- More sophisticated AI analysis
- Additional chain support
- Privacy-preserving reputation
- Reputation-based lending protocol
- DAO governance integration
- Social graph features
- Reputation NFT marketplace

## Competitive Advantages

### Why This Wins
1. **Solves Real Problem:** Fragmented identity is painful for everyone
2. **AI is Essential:** Can't manually analyze cross-chain behavior
3. **Both Chains Critical:** Stellar for payments, Polkadot for governance
4. **Clear Use Cases:** Lending, DAOs, community access
5. **Scalable Vision:** Can expand to more chains
6. **Easy to Demo:** Visual, impressive, understandable
7. **Production Potential:** Real projects would use this

### Differentiation
- **vs. Single-chain reputation:** We're cross-chain
- **vs. Manual verification:** We're automated with AI
- **vs. Simple aggregators:** We analyze behavior, not just count transactions
- **vs. Centralized identity:** We're decentralized and verifiable on-chain

## Go-to-Market (Post-Hackathon)

### Potential Users
- DeFi protocols (lending, borrowing)
- DAOs (governance, voting)
- NFT communities (allowlists, access)
- Gaming guilds (member verification)
- Grant programs (applicant screening)

### Integration Points
- Aave/Compound-style lending protocols
- Snapshot/Tally governance platforms
- Discord/Telegram bots for community gating
- Wallet providers (show reputation in wallet)

## Demo Script (5 Minutes)

### Minute 1: Problem
"Web3 reputation is fragmented. Your Stellar DeFi history means nothing on Polkadot. Your Polkadot governance participation is invisible on Stellar. This limits opportunities and creates friction."

### Minute 2: Solution
"ChainRepute uses AI to scan your activity on both Stellar and Polkadot, creating a unified reputation score. One identity, two chains, infinite possibilities."

### Minute 3: Demo
- Connect wallets (both chains)
- Click "Scan Activity"
- Show AI analyzing (loading animation)
- Display results: Score 850/1000, Governor profile
- Show breakdown: Stellar activity + Polkadot activity

### Minute 4: Credential
- Click "Mint Credential"
- Show transactions on both chains
- Display minted SBT on Polkadot
- Show stored data on Stellar
- Verify cross-chain credential

### Minute 5: Use Cases
- Show undercollateralized loan approval
- Display DAO voting power boost
- Demonstrate community access
- "This is the future of cross-chain identity"

## Key Messaging

### Elevator Pitch
"ChainRepute is a cross-chain identity protocol that uses AI to unify your Stellar and Polkadot reputation, enabling undercollateralized loans, DAO voting power, and community access based on your proven on-chain behavior."

### Value Propositions
- **For Users:** Your reputation follows you across chains
- **For Protocols:** Assess user trustworthiness across ecosystems
- **For DAOs:** Identify genuine contributors vs. sybils
- **For Communities:** Verify members without centralized KYC

### Why Stellar + Polkadot
"Stellar captures your financial reputation through payments and DeFi. Polkadot captures your governance reputation through voting and staking. Together, they paint a complete picture of your Web3 identity."


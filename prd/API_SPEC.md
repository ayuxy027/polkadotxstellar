# API Specification

## Overview
The ChainRepute backend provides RESTful API endpoints for scanning blockchain activity, calculating reputation scores, and verifying credentials.

## Base URL
- **Development:** `http://localhost:3000/api`
- **Production:** `https://your-domain.com/api`

## Authentication
No authentication required for hackathon MVP. All endpoints are public.

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the API is running.

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1701820800000,
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### 2. Scan Activity

**POST** `/scan`

Scan blockchain activity on both Stellar and Polkadot, calculate reputation score.

**Request:**
```http
POST /api/scan
Content-Type: application/json

{
  "stellarAddress": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "polkadotAddress": "5XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

**Request Body:**
```typescript
interface ScanRequest {
  stellarAddress: string;  // Stellar public key (G...)
  polkadotAddress: string; // Polkadot SS58 address (5...)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overallScore": 750,
    "profile": "Balanced",
    "stellar": {
      "transactionCount": 1250,
      "totalVolume": 50000,
      "liquidityProvided": 10000,
      "accountAge": 365,
      "assetDiversity": 5,
      "score": 380
    },
    "polkadot": {
      "governanceVotes": 15,
      "stakingAmount": 1000,
      "stakingDuration": 180,
      "validatorNominations": 3,
      "parachainInteractions": 8,
      "accountAge": 270,
      "score": 370
    },
    "breakdown": {
      "transactionConsistency": 150,
      "governanceParticipation": 187,
      "stakingBehavior": 150,
      "liquidityProvision": 112,
      "accountAge": 75,
      "assetDiversity": 50
    },
    "aiInsights": {
      "profile": "Balanced",
      "confidence": 85,
      "insights": "User shows consistent activity across both chains with strong governance participation.",
      "redFlags": []
    }
  }
}
```

**Response Body:**
```typescript
interface ScanResponse {
  success: boolean;
  data: ReputationData;
  error?: string;
}

interface ReputationData {
  overallScore: number;        // 0-1000
  profile: string;             // "Trader" | "Governor" | "Staker" | "Liquidity Provider" | "Balanced"
  stellar: StellarActivity;
  polkadot: PolkadotActivity;
  breakdown: ScoreBreakdown;
  aiInsights: AIInsights;
}

interface StellarActivity {
  transactionCount: number;
  totalVolume: number;         // In XLM
  liquidityProvided: number;   // In XLM
  accountAge: number;          // Days
  assetDiversity: number;      // Number of unique assets
  score: number;               // 0-450
}

interface PolkadotActivity {
  governanceVotes: number;
  stakingAmount: number;       // In DOT
  stakingDuration: number;     // Days
  validatorNominations: number;
  parachainInteractions: number;
  accountAge: number;          // Days
  score: number;               // 0-550
}

interface ScoreBreakdown {
  transactionConsistency: number;   // 0-200
  governanceParticipation: number;  // 0-250
  stakingBehavior: number;          // 0-200
  liquidityProvision: number;       // 0-150
  accountAge: number;               // 0-100
  assetDiversity: number;           // 0-100
}

interface AIInsights {
  profile: string;
  confidence: number;          // 0-100
  insights: string;
  redFlags: string[];
}
```

**Status Codes:**
- `200 OK` - Scan completed successfully
- `400 Bad Request` - Invalid addresses
- `404 Not Found` - Account not found on blockchain
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid Stellar address format",
  "statusCode": 400
}
```

---

### 3. Get Cached Reputation

**GET** `/reputation/:stellarAddress/:polkadotAddress`

Retrieve cached reputation data (if available).

**Request:**
```http
GET /api/reputation/GXXXXXXX.../5XXXXXXX...
```

**Response:**
Same as `/scan` endpoint response.

**Status Codes:**
- `200 OK` - Cached data found
- `404 Not Found` - No cached data available
- `500 Internal Server Error` - Server error

---

### 4. Verify Credential

**POST** `/verify-credential`

Verify that credentials exist on both Stellar and Polkadot chains.

**Request:**
```http
POST /api/verify-credential
Content-Type: application/json

{
  "stellarAddress": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "polkadotAddress": "5XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "stellar": {
      "exists": true,
      "score": 750,
      "timestamp": 1701820800000
    },
    "polkadot": {
      "exists": true,
      "score": 750,
      "tokenId": 42
    },
    "scoresMatch": true,
    "addressesLinked": true
  }
}
```

**Response Body:**
```typescript
interface VerifyResponse {
  success: boolean;
  data: VerificationResult;
}

interface VerificationResult {
  verified: boolean;           // Overall verification status
  stellar: {
    exists: boolean;
    score?: number;
    timestamp?: number;
  };
  polkadot: {
    exists: boolean;
    score?: number;
    tokenId?: number;
  };
  scoresMatch: boolean;        // Scores are within tolerance
  addressesLinked: boolean;    // Addresses are properly linked
}
```

**Status Codes:**
- `200 OK` - Verification completed
- `400 Bad Request` - Invalid addresses
- `500 Internal Server Error` - Server error

---

## External APIs Used

### Stellar Horizon API

**Base URL:** `https://horizon-testnet.stellar.org`

**Endpoints Used:**

1. **Get Account**
```http
GET /accounts/{account_id}
```

2. **Get Transactions**
```http
GET /accounts/{account_id}/transactions?limit=200&order=desc
```

3. **Get Payments**
```http
GET /accounts/{account_id}/payments?limit=200&order=desc
```

4. **Get Operations**
```http
GET /accounts/{account_id}/operations?limit=200&order=desc
```

**Documentation:** https://developers.stellar.org/api/horizon

---

### Subscan API (Polkadot)

**Base URL:** `https://polkadot.api.subscan.io`

**Headers Required:**
```http
Content-Type: application/json
X-API-Key: YOUR_SUBSCAN_API_KEY
```

**Endpoints Used:**

1. **Get Account Info**
```http
POST /api/v2/scan/search
{
  "key": "account_address"
}
```

2. **Get Governance Votes**
```http
POST /api/scan/democracy/votes
{
  "address": "account_address",
  "row": 100,
  "page": 0
}
```

3. **Get Staking Info**
```http
POST /api/scan/staking/nominators
{
  "address": "account_address"
}
```

**Documentation:** https://support.subscan.io/

**Alternative:** Polkadot.js API for direct node queries

---

### Groq AI API

**Base URL:** `https://api.groq.com/openai/v1`

**Headers Required:**
```http
Content-Type: application/json
Authorization: Bearer YOUR_GROQ_API_KEY
```

**Endpoint Used:**

**POST** `/chat/completions`

```json
{
  "model": "llama3-70b-8192",
  "messages": [
    {
      "role": "system",
      "content": "You are a blockchain reputation analyst."
    },
    {
      "role": "user",
      "content": "Analyze this cross-chain activity..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Alternative:** OpenAI API for comparison

---

## Backend Implementation

### Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── routes/
│   │   └── api.ts            # API route handlers
│   ├── services/
│   │   ├── stellar.ts        # Stellar blockchain scanner
│   │   ├── polkadot.ts       # Polkadot blockchain scanner
│   │   ├── ai.ts             # AI reputation engine
│   │   └── reputation.ts     # Reputation calculation logic
│   ├── utils/
│   │   ├── validation.ts     # Input validation
│   │   └── cache.ts          # Caching utilities
│   └── types/
│       └── index.ts          # TypeScript types
├── .env                      # Environment variables
├── package.json
└── tsconfig.json
```

### Core Services

#### Stellar Scanner Service

```typescript
// src/services/stellar.ts

import { Server } from '@stellar/stellar-sdk';

const server = new Server('https://horizon-testnet.stellar.org');

export async function scanStellarActivity(address: string): Promise<StellarActivity> {
  // Fetch account data
  const account = await server.loadAccount(address);
  
  // Fetch transactions
  const transactions = await server.transactions()
    .forAccount(address)
    .limit(200)
    .order('desc')
    .call();
  
  // Fetch payments
  const payments = await server.payments()
    .forAccount(address)
    .limit(200)
    .order('desc')
    .call();
  
  // Calculate metrics
  const transactionCount = transactions.records.length;
  const totalVolume = calculateVolume(payments.records);
  const accountAge = calculateAccountAge(account);
  const assetDiversity = account.balances.length;
  
  // Calculate score
  const score = calculateStellarScore({
    transactionCount,
    totalVolume,
    accountAge,
    assetDiversity,
  });
  
  return {
    transactionCount,
    totalVolume,
    liquidityProvided: 0, // TODO: Implement LP detection
    accountAge,
    assetDiversity,
    score,
  };
}
```

#### Polkadot Scanner Service

```typescript
// src/services/polkadot.ts

import axios from 'axios';

const SUBSCAN_API = 'https://polkadot.api.subscan.io';
const SUBSCAN_KEY = process.env.SUBSCAN_API_KEY;

export async function scanPolkadotActivity(address: string): Promise<PolkadotActivity> {
  // Fetch account info
  const accountInfo = await axios.post(
    `${SUBSCAN_API}/api/v2/scan/search`,
    { key: address },
    { headers: { 'X-API-Key': SUBSCAN_KEY } }
  );
  
  // Fetch governance votes
  const votes = await axios.post(
    `${SUBSCAN_API}/api/scan/democracy/votes`,
    { address, row: 100, page: 0 },
    { headers: { 'X-API-Key': SUBSCAN_KEY } }
  );
  
  // Fetch staking info
  const staking = await axios.post(
    `${SUBSCAN_API}/api/scan/staking/nominators`,
    { address },
    { headers: { 'X-API-Key': SUBSCAN_KEY } }
  );
  
  // Calculate metrics
  const governanceVotes = votes.data?.data?.count || 0;
  const stakingAmount = staking.data?.data?.bonded || 0;
  const accountAge = calculateAccountAge(accountInfo.data);
  
  // Calculate score
  const score = calculatePolkadotScore({
    governanceVotes,
    stakingAmount,
    accountAge,
  });
  
  return {
    governanceVotes,
    stakingAmount,
    stakingDuration: 0, // TODO: Calculate from staking history
    validatorNominations: 0,
    parachainInteractions: 0,
    accountAge,
    score,
  };
}
```

#### AI Reputation Engine

```typescript
// src/services/ai.ts

import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeReputation(
  stellarActivity: StellarActivity,
  polkadotActivity: PolkadotActivity
): Promise<AIInsights> {
  const prompt = `
Analyze the following cross-chain blockchain activity:

Stellar Activity:
- Transactions: ${stellarActivity.transactionCount}
- Volume: ${stellarActivity.totalVolume} XLM
- Account Age: ${stellarActivity.accountAge} days
- Assets: ${stellarActivity.assetDiversity}

Polkadot Activity:
- Governance Votes: ${polkadotActivity.governanceVotes}
- Staking: ${polkadotActivity.stakingAmount} DOT
- Account Age: ${polkadotActivity.accountAge} days

Provide:
1. Reputation profile (Trader/Governor/Staker/Liquidity Provider/Balanced)
2. Confidence score (0-100)
3. Brief insights (1-2 sentences)
4. Any red flags

Return JSON format only.
`;

  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a blockchain reputation analyst. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_completion_tokens: 500,
    top_p: 1,
    stream: false,
    stop: null
  });

  const result = JSON.parse(response.choices[0].message.content);

  return {
    profile: result.profile,
    confidence: result.confidence,
    insights: result.insights,
    redFlags: result.redFlags || [],
  };
}
```

#### Reputation Calculation

```typescript
// src/services/reputation.ts

export function calculateFinalScore(
  stellarScore: number,
  polkadotScore: number,
  aiInsights: AIInsights
): number {
  const baseScore = stellarScore + polkadotScore;
  
  // AI can adjust score by ±10%
  const aiAdjustment = (aiInsights.confidence - 50) / 500; // -0.1 to +0.1
  const adjustedScore = baseScore * (1 + aiAdjustment);
  
  return Math.min(1000, Math.max(0, Math.round(adjustedScore)));
}

export function calculateScoreBreakdown(
  stellarActivity: StellarActivity,
  polkadotActivity: PolkadotActivity
): ScoreBreakdown {
  return {
    transactionConsistency: Math.min(200, stellarActivity.transactionCount / 10),
    governanceParticipation: Math.min(250, polkadotActivity.governanceVotes * 10),
    stakingBehavior: Math.min(200, polkadotActivity.stakingAmount / 5),
    liquidityProvision: Math.min(150, stellarActivity.liquidityProvided / 100),
    accountAge: Math.min(100, (stellarActivity.accountAge + polkadotActivity.accountAge) / 6),
    assetDiversity: Math.min(100, stellarActivity.assetDiversity * 10),
  };
}
```

### API Route Handler

```typescript
// src/routes/api.ts

import express from 'express';
import { scanStellarActivity } from '../services/stellar';
import { scanPolkadotActivity } from '../services/polkadot';
import { analyzeReputation } from '../services/ai';
import { calculateFinalScore, calculateScoreBreakdown } from '../services/reputation';

const router = express.Router();

router.post('/scan', async (req, res) => {
  try {
    const { stellarAddress, polkadotAddress } = req.body;
    
    // Validate addresses
    if (!stellarAddress || !polkadotAddress) {
      return res.status(400).json({
        success: false,
        error: 'Both stellarAddress and polkadotAddress are required',
      });
    }
    
    // Scan both chains in parallel
    const [stellarActivity, polkadotActivity] = await Promise.all([
      scanStellarActivity(stellarAddress),
      scanPolkadotActivity(polkadotAddress),
    ]);
    
    // Get AI insights
    const aiInsights = await analyzeReputation(stellarActivity, polkadotActivity);
    
    // Calculate final score
    const overallScore = calculateFinalScore(
      stellarActivity.score,
      polkadotActivity.score,
      aiInsights
    );
    
    // Calculate breakdown
    const breakdown = calculateScoreBreakdown(stellarActivity, polkadotActivity);
    
    res.json({
      success: true,
      data: {
        overallScore,
        profile: aiInsights.profile,
        stellar: stellarActivity,
        polkadot: polkadotActivity,
        breakdown,
        aiInsights,
      },
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
```

---

## Rate Limiting

### Implementation

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);
```

---

## CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
```

---

## Environment Variables

```bash
# .env

PORT=3000
NODE_ENV=development

# AI Provider
GROQ_API_KEY=gsk_...
# OR
OPENAI_API_KEY=sk-...

# Blockchain APIs
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
SUBSCAN_API_KEY=your_subscan_key
POLKADOT_RPC_URL=wss://rococo-contracts-rpc.polkadot.io

# CORS
CORS_ORIGIN=http://localhost:5173

# Contract Addresses (update after deployment)
STELLAR_CONTRACT_ID=
POLKADOT_CONTRACT_ADDRESS=
```

---

## Testing

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Scan activity
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "stellarAddress": "GXXXXXXX...",
    "polkadotAddress": "5XXXXXXX..."
  }'

# Verify credential
curl -X POST http://localhost:3000/api/verify-credential \
  -H "Content-Type: application/json" \
  -d '{
    "stellarAddress": "GXXXXXXX...",
    "polkadotAddress": "5XXXXXXX..."
  }'
```

---

## Deployment

### Railway/Render Deployment

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Environment Variables (Production)
- Set all API keys
- Update CORS_ORIGIN to production frontend URL
- Set NODE_ENV=production


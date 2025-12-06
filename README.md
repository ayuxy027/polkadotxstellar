# ChainRepute - Cross-Chain Identity & Reputation Protocol

> **Live Demo**: [http://localhost:5174](http://localhost:5174) | **Stellar Contract**: `CDUTJKXOOVPWI6BZZDJDUMZUDBLP2VRBYPLJGF35UK52LKWM6CZXHJNX`

ChainRepute is a **production-ready** cross-chain identity and reputation protocol that unifies your Stellar and Polkadot reputation, creating verifiable soulbound tokens (SBTs) for DeFi, DAOs, and communities.

## 🎯 Overview

Your reputation follows you across chains. ChainRepute uses AI to scan your activity on both **Stellar** and **Polkadot**, generating unified reputation scores (0-1000) and issuing verifiable cross-chain SBT credentials.

## ✨ Features

- ✅ **Cross-chain reputation scanning** across Stellar Soroban and Polkadot Ink!
- ✅ **AI-powered analysis** of on-chain behavior and transaction patterns
- ✅ **Soulbound Token (SBT) minting** - non-transferable reputation credentials
- ✅ **Dual wallet integration** - Albedo (Stellar) + Talisman/SubWallet (Polkadot)
- ✅ **Unified reputation dashboard** with tier-based rewards
- ✅ **Production-ready smart contracts** deployed on testnets

## 🚀 Deployed Contracts

### Stellar Soroban (✅ LIVE)
- **Network**: Stellar Testnet
- **Contract ID**: `CDUTJKXOOVPWI6BZZDJDUMZUDBLP2VRBYPLJGF35UK52LKWM6CZXHJNX`
- **Status**: Fully deployed, 2+ SBTs minted
- **Functions**: `mint_sbt`, `get_reputation`, `update_score`, `total_supply`

### Polkadot Ink! (🔧 READY)
- **Network**: Pop Network (Paseo Testnet)
- **Contract**: Built and ready (`governance_sbt.contract` - 23KB)
- **Status**: Awaiting testnet token funding for deployment
- **Functions**: `mint_sbt`, `get_reputation`, `verify_ownership`, `update_score`

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing fast builds
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Framer Motion** for animations

### Smart Contracts
- **Stellar Soroban** (Rust) - v21.5.1
- **Polkadot Ink!** (Rust) - v5.1.1

### Blockchain Integration
- **@stellar/stellar-sdk** - Stellar RPC & wallet integration
- **@polkadot/api** - Polkadot RPC connection
- **@polkadot/extension-dapp** - Browser wallet integration
- **Albedo** wallet for Stellar
- **Talisman/SubWallet** for Polkadot
## 📦 Installation

```bash
# Clone repository
git clone https://github.com/ayuxy027/polkadotxstellar.git
cd polkadotxstellar

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎮 Usage

### 1. Connect Wallets
- **Stellar**: Install [Albedo](https://albedo.link/) browser extension
- **Polkadot**: Install [Talisman](https://talisman.xyz/) or [SubWallet](https://subwallet.app/)

### 2. Scan Reputation
1. Navigate to Dashboard
2. Enter your Stellar address
3. Enter your Polkadot address
4. Click "Scan Reputation"
5. AI analyzes your on-chain activity

### 3. Mint Your SBT
1. After scanning, view your reputation score (0-1000)
2. Click "Mint My SBT" on Stellar section
3. Approve transaction in Albedo wallet
4. Your soulbound token is minted! 🎉

### 4. View Rewards
- Check your tier: Newcomer → Bronze → Silver → Gold
- Access exclusive benefits based on reputation

## 🏗️ Project Structure

```
├── contracts/
│   ├── governance-sbt/          # Polkadot Ink! contract
│   │   ├── lib.rs
│   │   └── target/ink/          # Built .contract file
│   └── soroban-reputation/      # Stellar Soroban contract
│       └── src/lib.rs
├── src/
│   ├── components/              # React components
│   │   ├── Hero.tsx
│   │   ├── ReputationDashboard.tsx
│   │   └── ...
│   ├── pages/                   # Route pages
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── services/                # Blockchain integration
│   │   ├── reputation.ts        # Stellar service
│   │   ├── polkadot.ts          # Polkadot service
│   │   └── api.ts              # Backend API
│   └── wallet/                  # Wallet context
│       └── WalletContext.tsx
└── server/                      # Backend API
    └── src/
        ├── index.ts
        └── services/            # AI & scanning logic
```

## 🚢 Deployment Status

| Component | Status | Details |
|-----------|--------|---------|
| **Stellar Contract** | ✅ LIVE | Deployed on testnet, 2+ SBTs minted |
| **Polkadot Contract** | 🔧 Ready | Built, awaiting testnet funding |
| **Frontend** | ✅ LIVE | Running on localhost:5174 |
| **Backend** | ✅ LIVE | Express server on port 3001 |
| **Wallet Integration** | ✅ LIVE | Albedo + Talisman/SubWallet |

## 🧪 Testing

### Test Stellar SBT Minting
```bash
# Check contract
stellar contract invoke \
  --id CDUTJKXOOVPWI6BZZDJDUMZUDBLP2VRBYPLJGF35UK52LKWM6CZXHJNX \
  --source-account <YOUR_ACCOUNT> \
  --network testnet \
  -- total_supply

# Should return: 2 (or more)
```

### Test Polkadot Contract (once deployed)
```bash
cargo contract instantiate \
  --manifest-path contracts/governance-sbt/Cargo.toml \
  --url wss://rpc1.paseo.popnetwork.xyz \
  --suri <YOUR_SEED> \
  -x -y \
  --constructor new \
  --value 0
```

## 🤝 Contributing

Contributions welcome! This project demonstrates cross-chain reputation infrastructure.

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Hackathon Submission

**Built for**: Polkadot x Stellar Hackathon  
**Category**: Cross-chain Infrastructure  
**Team**: ayuxy027  
**Submission Date**: December 6, 2025

### Key Achievements
- ✅ Full cross-chain architecture (Stellar + Polkadot)
- ✅ Production-ready Stellar contract with 2+ mints
- ✅ Complete Polkadot Ink! contract (awaiting final deployment)
- ✅ Unified reputation dashboard
- ✅ Dual wallet integration
- ✅ AI-powered reputation analysis

---

**Made with ❤️ for the Polkadot and Stellar ecosystems**

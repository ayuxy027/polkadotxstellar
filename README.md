# ChainRepute

Welcome to **ChainRepute** 🔗

## Project Overview

**ChainRepute** is a cross-chain reputation protocol that unifies your on-chain reputation across Stellar and Polkadot ecosystems. We scan your on-chain activity, generate an AI-powered score (0-1000), and mint it as non-transferable Soulbound Tokens on both networks.

**🏆 ChainRepute Stood Top 10 at Polkadot x Stellar Hacker House 2025 🎉**

## Tech Stack

### **Frontend**
- **React 19** with TypeScript
- **Vite**
- **Tailwind CSS**
- **Framer Motion**
- **React Router DOM**

### **Backend**
- **Node.js/Express** with TypeScript

### **Blockchain & Smart Contracts**
- **Stellar Soroban** (Rust-based smart contracts)
- **Polkadot Ink!** (Rust-based WASM contracts)
- **@stellar/stellar-sdk** - Stellar blockchain integration
- **@polkadot/api** - Polkadot RPC connection

### **Wallets**
- **Albedo** - Stellar wallet integration
- **Talisman/SubWallet** - Polkadot wallet integration

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Reputation  │  │    Wallet    │  │     SBT      │ │
│  │  Dashboard   │  │  Integration │  │   Minting    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (Express/Node)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  AI Engine   │  │   Stellar    │  │   Polkadot   │ │
│  │   Scanner    │  │   Scanner    │  │   Scanner    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
┌──────────────────────┐         ┌──────────────────────┐
│   Stellar Network    │         │  Polkadot Network    │
│  ┌────────────────┐  │         │  ┌────────────────┐  │
│  │ Soroban SBT    │  │         │  │  Ink! SBT      │  │
│  │   Contract     │  │         │  │  Contract      │  │
│  └────────────────┘  │         │  └────────────────┘  │
│    (Deployed ✅)     │         │   (Ready 🔧)        │
└──────────────────────┘         └──────────────────────┘
```

## Features

- **Cross-Chain Scanning** - Analyze reputation across Stellar and Polkadot
- **AI-Powered Analysis** - Smart scoring algorithm (0-1000 scale)
- **Soulbound Token Minting** - Non-transferable reputation NFTs
- **Dual Wallet Integration** - Seamless Albedo + Talisman/SubWallet support
- **Unified Dashboard** - Single interface for both chains
- **Tier-Based Rewards** - Newcomer → Bronze → Silver → Gold progression

## Setup and Installation

1. **Clone this repository:**
   ```bash
   git clone https://github.com/ayuxy027/ChainRepute.git
   cd ChainRepute
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Create a `.env` file** in the root directory:
   ```env
   # Stellar Configuration
   VITE_STELLAR_NETWORK=testnet
   VITE_STELLAR_RPC=https://soroban-testnet.stellar.org
   VITE_STELLAR_CONTRACT=CDUTJKXOOVPWI6BZZDJDUMZUDBLP2VRBYPLJGF35UK52LKWM6CZXHJNX

   # Polkadot Configuration  
   VITE_POLKADOT_RPC=wss://rpc1.paseo.popnetwork.xyz
   VITE_POLKADOT_CONTRACT=<contract-address-after-deployment>

   # Backend API
   VITE_API_URL=http://localhost:3001
   ```

5. **Start the development server:**
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev

   # Terminal 2 - Start frontend
   npm run dev
   ```

## Links & Resources

- **Live Demo:** https://chainrepute.vercel.app/
- **GitHub Repository:** https://github.com/ayuxy027/ChainRepute
- **Smart Contract Addresses:**
  - Stellar Soroban SBT (Testnet): `CDUTJKXOOVPWI6BZZDJDUMZUDBLP2VRBYPLJGF35UK52LKWM6CZXHJNX`
  - Polkadot Ink! SBT (Pop Network Testnet): *Awaiting deployment*

## Contributing

**Contributions are welcomed!** 😁

Let's keep the spirit of open source alive!

### **Important**
- Please follow the project's **license terms** before redistributing or modifying.
- Creating something from scratch takes a lot of hard work, and I hope you respect that. 😄
- If you have any questions or need permission for something specific, feel free to reach out.

## Contact

If you have any inquiries or suggestions, please reach out:
- **Email:** [ayush421301@gmail.com](mailto:ayush421301@gmail.com)
- **X (Twitter):** [ayuxy027](https://x.com/ayuxy027)
- **GitHub:** [ayuxy027](https://github.com/ayuxy027)

---

**Built for Polkadot x Stellar Hacker House 2025** 🎉

*Unifying Web3 reputation, one chain at a time.*

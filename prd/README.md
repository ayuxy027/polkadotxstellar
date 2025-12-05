# ChainRepute - Product Requirements Documentation

## 📋 Overview

This directory contains comprehensive documentation for **ChainRepute**, a cross-chain identity and reputation protocol for the Stellar x Polkadot HackerHouse BLR hackathon.

**Project Tagline:** "Your reputation follows you across chains"

**Problem:** Web3 users build reputation across multiple blockchains, but this reputation is fragmented and siloed. Users must rebuild reputation from scratch on every chain, limiting cross-chain opportunities.

**Solution:** An AI-powered cross-chain identity protocol that aggregates user activity from Stellar and Polkadot, generates unified reputation scores, and issues verifiable cross-chain credentials.

---

## 📁 Documentation Files

### 1. [HACKATHON_CONTEXT.md](./HACKATHON_CONTEXT.md)
**Purpose:** Complete context about the hackathon requirements and judging criteria.

**Contains:**
- Event details and timeline
- Core requirements (MUST use both Stellar AND Polkadot)
- Judging criteria and priorities
- Submission requirements
- Ecosystem details (Stellar vs Polkadot strengths)
- Success strategies
- What judges want to see

**Read this first** to understand the hackathon constraints and requirements.

---

### 2. [PRODUCT.md](./PRODUCT.md)
**Purpose:** Complete product requirements document.

**Contains:**
- Problem statement and market need
- Solution overview and user flow
- Why both chains are essential
- Core features (MVP scope)
- Technical architecture overview
- User stories and personas
- Success metrics
- Out of scope items
- Competitive advantages
- Demo script outline
- Key messaging

**Read this second** to understand what you're building and why.

---

### 3. [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)
**Purpose:** Detailed technical specifications and architecture.

**Contains:**
- System architecture diagram
- Complete technology stack
- Component specifications (Frontend, Backend, Contracts)
- Data structures and interfaces
- API integration details (Stellar Horizon, Subscan, Groq)
- Data flow diagrams
- Environment configuration
- Error handling strategies
- Performance considerations
- Security best practices
- Testing strategy
- Deployment plan

**Read this third** to understand how to build it.

---

### 4. [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
**Purpose:** Hour-by-hour implementation plan for the 28-hour sprint.

**Contains:**
- Team structure recommendations
- Hour-by-hour timeline (2 AM Dec 5 → 8 AM Dec 6)
- Task breakdown by role
- Parallel work opportunities
- Sync points and communication protocol
- Git workflow and commit strategy
- Testing checklist
- Troubleshooting guide
- Demo day preparation
- Backup plans
- Success metrics

**Use this as your execution roadmap** during the hackathon.

---

### 5. [CONTRACTS.md](./CONTRACTS.md)
**Purpose:** Smart contract specifications for both chains.

**Contains:**
- Stellar Soroban contract specification
  - Storage structure
  - Functions (store, get, update, verify)
  - Events
  - Build and deploy commands
  - Frontend integration code
- Polkadot Ink! contract specification
  - Storage structure
  - Functions (mint SBT, get, verify, update)
  - Soulbound token implementation
  - Build and deploy commands
  - Frontend integration code
- Cross-chain verification logic
- Testing strategies
- Security considerations
- Troubleshooting guide

**Use this to build and deploy smart contracts.**

---

### 6. [API_SPEC.md](./API_SPEC.md)
**Purpose:** Backend API specifications and implementation.

**Contains:**
- API endpoint specifications
  - POST /scan (scan blockchain activity)
  - GET /reputation (get cached data)
  - POST /verify-credential (verify cross-chain credential)
  - GET /health (health check)
- Request/response formats
- External API integration
  - Stellar Horizon API
  - Subscan API (Polkadot)
  - Groq API
- Backend service implementations
  - Stellar scanner
  - Polkadot scanner
  - AI reputation engine
  - Reputation calculation logic
- Rate limiting and CORS
- Environment variables
- Testing and deployment

**Use this to build the backend API.**

---

### 7. [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
**Purpose:** Complete demo video script and pitch guide.

**Contains:**
- 5-minute demo video structure
  - Minute 1: Hook & Problem
  - Minute 2: Solution Overview
  - Minute 3: Live Demo
  - Minute 4: Use Cases
  - Minute 5: Why Both Chains & Closing
- Live pitch structure (if presenting)
- Q&A preparation (10+ expected questions with answers)
- Demo video production tips
- Recording and editing checklist
- Backup plans if demo fails
- Presentation delivery tips

**Use this to create your demo video and prepare your pitch.**

---

## 🎯 Quick Start Guide

### For AI Agents / Developers

**If you're starting from scratch:**

1. **Read in this order:**
   - HACKATHON_CONTEXT.md (understand constraints)
   - PRODUCT.md (understand what to build)
   - TECHNICAL_SPEC.md (understand how to build)
   - IMPLEMENTATION_GUIDE.md (understand when to build what)

2. **During implementation:**
   - Follow IMPLEMENTATION_GUIDE.md timeline
   - Reference CONTRACTS.md for smart contracts
   - Reference API_SPEC.md for backend
   - Reference TECHNICAL_SPEC.md for frontend

3. **For demo preparation:**
   - Follow DEMO_SCRIPT.md
   - Practice the pitch multiple times
   - Record demo video early (leave time for retakes)

### For Team Leads

**Day 1 (Dec 5, Morning):**
- [ ] Entire team reads HACKATHON_CONTEXT.md and PRODUCT.md
- [ ] Assign roles based on IMPLEMENTATION_GUIDE.md
- [ ] Set up development environment
- [ ] Attend workshops and take notes

**Day 1 (Dec 5, Afternoon/Evening):**
- [ ] Follow IMPLEMENTATION_GUIDE.md timeline
- [ ] Build core features (wallet connection, scanning, dashboard)
- [ ] Deploy smart contracts using CONTRACTS.md

**Day 2 (Dec 6, Early Morning):**
- [ ] Complete credential minting
- [ ] Record demo video using DEMO_SCRIPT.md
- [ ] Test everything end-to-end
- [ ] Submit project

---

## 🏗️ Project Structure

### Recommended Repository Structure

```
chainrepute/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API calls, wallet integration
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   ├── .env                 # Environment variables
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Blockchain scanners, AI engine
│   │   ├── utils/           # Helper functions
│   │   └── index.ts         # Express app
│   ├── .env                 # Environment variables
│   └── package.json
│
├── contracts/
│   ├── stellar/             # Soroban contract
│   │   └── src/lib.rs
│   └── polkadot/            # Ink! contract
│       └── lib.rs
│
├── prd/                      # This documentation (you are here)
│   ├── README.md
│   ├── HACKATHON_CONTEXT.md
│   ├── PRODUCT.md
│   ├── TECHNICAL_SPEC.md
│   ├── IMPLEMENTATION_GUIDE.md
│   ├── CONTRACTS.md
│   ├── API_SPEC.md
│   └── DEMO_SCRIPT.md
│
└── README.md                 # Project README
```

---

## 🎬 Critical Success Factors

### Must-Have Features (Non-Negotiable)
1. ✅ Connect both Stellar and Polkadot wallets
2. ✅ Scan activity on both chains
3. ✅ Display unified reputation score
4. ✅ Mint credential on both chains
5. ✅ Demo video showing complete flow

### What Wins Hackathons
- **Working demo** > Complex features
- **Clear value proposition** > Technical complexity
- **Cross-chain integration** > Single-chain perfection
- **Good pitch** > Perfect code
- **Demo video** > Live demo (less risky)

### Time Allocation
- **40%** - Core functionality (wallet, scan, display)
- **30%** - Credential minting (critical feature)
- **20%** - Demo video and pitch preparation
- **10%** - Polish and bug fixes

---

## 🚀 Key Differentiators

### Why This Project Wins

1. **Solves Real Problem**
   - Fragmented identity is painful for everyone
   - Clear, relatable problem statement

2. **AI is Essential**
   - Can't manually analyze cross-chain behavior
   - AI adds real value, not just buzzword

3. **Both Chains Critical**
   - Stellar: Financial reputation (payments, DeFi)
   - Polkadot: Governance reputation (voting, staking)
   - Complementary, not redundant

4. **Clear Use Cases**
   - Undercollateralized lending
   - DAO voting power
   - Community access/verification

5. **Scalable Vision**
   - Can expand to more chains
   - Real protocols would use this
   - Production potential

6. **Easy to Demo**
   - Visual and impressive
   - Understandable by non-technical judges
   - Shows cross-chain magic clearly

---

## 📊 Success Metrics

### Minimum Viable Demo
- Both wallets connect
- Scan shows data from both chains
- Reputation score displays
- Credential mints on at least one chain
- Demo video shows complete flow

### Competitive Demo
- All MVP features +
- Credentials mint on both chains
- AI provides insights
- Use cases demonstrated
- Polished UI

### Winning Demo
- All competitive features +
- Flawless demo video
- Compelling pitch
- Real wallet addresses with activity
- Production-ready code quality

---

## ⚠️ Common Pitfalls to Avoid

### Don't Do This
- ❌ Overcomplicate the solution
- ❌ Add features that don't work
- ❌ Skip the demo video
- ❌ Ignore the workshops
- ❌ Work in isolation (communicate!)
- ❌ Forget to eat and sleep
- ❌ Try to build everything perfectly

### Do This Instead
- ✅ Keep it simple and working
- ✅ Focus on core user journey
- ✅ Make demo video top priority
- ✅ Use mentors heavily
- ✅ Sync with team every 4 hours
- ✅ Take care of yourself
- ✅ Ship something that works

---

## 🎓 Learning Resources

### Stellar Resources
- Soroban Docs: https://soroban.stellar.org/docs
- Horizon API: https://developers.stellar.org/api/horizon
- Freighter Wallet: https://www.freighter.app/

### Polkadot Resources
- Ink! Docs: https://use.ink/
- Polkadot.js: https://polkadot.js.org/docs/
- Contracts UI: https://contracts-ui.substrate.io/

### AI Resources
- Groq API: https://console.groq.com/docs

---

## 📞 Support

### During Hackathon
- **Mentors:** Use mandatory mentoring sessions (Dec 5, 2:30-5:30 PM)
- **Workshops:** Attend Stellar x Polkadot workshops (Dec 5, 10:30 AM - 1 PM)
- **Team:** Sync every 4 hours
- **Documentation:** Reference these PRD files

### Emergency Protocol
- If stuck for >30 minutes, ask for help
- Don't waste time on non-critical features
- Pivot if something isn't working
- Focus on the demo video

---

## 🏆 Final Reminders

### The Winning Formula
```
Working Demo + Clear Pitch + Cross-Chain Integration = Win
```

### Time Management
- **Don't:** Spend 20 hours on perfect code, 1 hour on demo
- **Do:** Spend 15 hours on working code, 5 hours on demo

### Priorities
1. Demo video (this is what judges see first)
2. Core functionality (wallet → scan → mint)
3. Cross-chain integration (both chains essential)
4. Polish and use cases (if time permits)

---

## 🎉 You Got This!

Remember:
- **Simple + Working > Complex + Broken**
- **Demo Video > Perfect Code**
- **Cross-Chain Integration > Feature Count**
- **Clear Pitch > Technical Jargon**

Now go build something amazing! 💪🚀

---

## 📝 Document Version

- **Version:** 1.0
- **Last Updated:** December 5, 2024, 2:00 AM
- **Hackathon:** Stellar x Polkadot HackerHouse BLR
- **Dates:** December 4-6, 2024
- **Team:** [Your Team Name]

---

**Good luck! 🍀**


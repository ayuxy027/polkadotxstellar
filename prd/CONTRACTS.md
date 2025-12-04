# Smart Contracts Specification

## Overview
ChainRepute requires two smart contracts working in tandem:
1. **Stellar Soroban Contract:** Stores reputation data and metadata
2. **Polkadot Ink! Contract:** Issues non-transferable Soulbound Tokens (SBTs)

Both contracts must be deployed to testnets and interact with the frontend.

---

## Stellar Soroban Contract

### Contract Name
`ReputationRegistry`

### Purpose
Store and manage reputation scores and metadata on Stellar blockchain.

### Network
- **Testnet:** Futurenet (Soroban testnet)
- **RPC:** https://rpc-futurenet.stellar.org
- **Horizon:** https://horizon-futurenet.stellar.org

### Storage Structure

```rust
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Map};

#[contracttype]
pub struct ReputationData {
    pub score: u32,                    // 0-1000
    pub profile: String,               // "Trader", "Governor", "Staker", etc.
    pub polkadot_address: String,      // Linked Polkadot address
    pub timestamp: u64,                // Unix timestamp
    pub verified: bool,                // Verification status
}

#[contract]
pub struct ReputationRegistry;
```

### Functions

#### 1. Initialize Contract
```rust
#[contractimpl]
impl ReputationRegistry {
    pub fn initialize(env: Env, admin: Address) {
        // Set contract admin
        env.storage().instance().set(&symbol_short!("admin"), &admin);
    }
}
```

#### 2. Store Reputation
```rust
pub fn store_reputation(
    env: Env,
    user: Address,
    score: u32,
    profile: String,
    polkadot_address: String,
) -> Result<(), Error> {
    // Verify user is calling for themselves
    user.require_auth();
    
    // Validate score range
    if score > 1000 {
        return Err(Error::InvalidScore);
    }
    
    // Create reputation data
    let reputation = ReputationData {
        score,
        profile,
        polkadot_address,
        timestamp: env.ledger().timestamp(),
        verified: true,
    };
    
    // Store in map
    env.storage().persistent().set(&user, &reputation);
    
    // Emit event
    env.events().publish(
        (symbol_short!("stored"), user.clone()),
        (score, env.ledger().timestamp())
    );
    
    Ok(())
}
```

#### 3. Get Reputation
```rust
pub fn get_reputation(
    env: Env,
    user: Address,
) -> Option<ReputationData> {
    env.storage().persistent().get(&user)
}
```

#### 4. Update Score
```rust
pub fn update_score(
    env: Env,
    user: Address,
    new_score: u32,
) -> Result<(), Error> {
    // Only user can update their own score
    user.require_auth();
    
    // Validate score
    if new_score > 1000 {
        return Err(Error::InvalidScore);
    }
    
    // Get existing reputation
    let mut reputation: ReputationData = env.storage()
        .persistent()
        .get(&user)
        .ok_or(Error::NotFound)?;
    
    let old_score = reputation.score;
    reputation.score = new_score;
    reputation.timestamp = env.ledger().timestamp();
    
    // Update storage
    env.storage().persistent().set(&user, &reputation);
    
    // Emit event
    env.events().publish(
        (symbol_short!("updated"), user.clone()),
        (old_score, new_score)
    );
    
    Ok(())
}
```

#### 5. Verify Credential
```rust
pub fn verify_credential(
    env: Env,
    user: Address,
) -> bool {
    match env.storage().persistent().get::<Address, ReputationData>(&user) {
        Some(data) => data.verified,
        None => false,
    }
}
```

### Error Types
```rust
#[contracttype]
pub enum Error {
    NotFound = 1,
    InvalidScore = 2,
    Unauthorized = 3,
    AlreadyExists = 4,
}
```

### Events
```rust
// Event: Reputation Stored
// Topics: ("stored", user_address)
// Data: (score, timestamp)

// Event: Reputation Updated
// Topics: ("updated", user_address)
// Data: (old_score, new_score)
```

### Build & Deploy Commands

```bash
# Navigate to contract directory
cd stellar-reputation

# Build contract
soroban contract build

# Deploy to Futurenet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/reputation_registry.wasm \
  --source <YOUR_SECRET_KEY> \
  --rpc-url https://rpc-futurenet.stellar.org \
  --network-passphrase "Test SDF Future Network ; October 2022"

# Initialize contract
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <YOUR_SECRET_KEY> \
  --rpc-url https://rpc-futurenet.stellar.org \
  --network-passphrase "Test SDF Future Network ; October 2022" \
  -- initialize \
  --admin <ADMIN_ADDRESS>
```

### Frontend Integration

```typescript
import { SorobanRpc, Contract, TransactionBuilder } from '@stellar/stellar-sdk';

// Initialize contract
const contract = new Contract(CONTRACT_ID);

// Store reputation
async function storeReputation(
  userAddress: string,
  score: number,
  profile: string,
  polkadotAddress: string
) {
  const account = await server.getAccount(userAddress);
  
  const transaction = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: 'Test SDF Future Network ; October 2022',
  })
    .addOperation(
      contract.call(
        'store_reputation',
        userAddress,
        score,
        profile,
        polkadotAddress
      )
    )
    .setTimeout(30)
    .build();
  
  // Sign with Freighter
  const signedTx = await window.freighter.signTransaction(transaction.toXDR());
  
  // Submit
  const result = await server.sendTransaction(signedTx);
  return result;
}

// Get reputation
async function getReputation(userAddress: string) {
  const result = await contract.call('get_reputation', userAddress);
  return result;
}
```

---

## Polkadot Ink! Contract

### Contract Name
`ReputationSBT`

### Purpose
Issue non-transferable Soulbound Tokens representing cross-chain reputation.

### Network
- **Testnet:** Contracts parachain on Rococo
- **RPC:** wss://rococo-contracts-rpc.polkadot.io
- **Explorer:** https://contracts-ui.substrate.io/

### Storage Structure

```rust
#![cfg_attr(not(feature = "std"), no_std)]

use ink::prelude::string::String;
use ink::storage::Mapping;

#[ink::contract]
mod reputation_sbt {
    use super::*;

    #[ink(storage)]
    pub struct ReputationSBT {
        /// Mapping from account to reputation data
        reputation_data: Mapping<AccountId, ReputationData>,
        /// Total SBTs minted
        total_supply: u64,
        /// Contract owner
        owner: AccountId,
    }

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct ReputationData {
        pub score: u32,
        pub profile: String,
        pub stellar_address: String,
        pub minted_at: u64,
        pub token_id: u64,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        AlreadyMinted,
        NotFound,
        Unauthorized,
        InvalidScore,
        TransferNotAllowed, // SBTs are non-transferable
    }

    pub type Result<T> = core::result::Result<T, Error>;
}
```

### Functions

#### 1. Constructor
```rust
impl ReputationSBT {
    #[ink(constructor)]
    pub fn new() -> Self {
        Self {
            reputation_data: Mapping::default(),
            total_supply: 0,
            owner: Self::env().caller(),
        }
    }
}
```

#### 2. Mint SBT
```rust
#[ink(message)]
pub fn mint_sbt(
    &mut self,
    score: u32,
    profile: String,
    stellar_address: String,
) -> Result<u64> {
    let caller = self.env().caller();
    
    // Check if already minted
    if self.reputation_data.contains(&caller) {
        return Err(Error::AlreadyMinted);
    }
    
    // Validate score
    if score > 1000 {
        return Err(Error::InvalidScore);
    }
    
    // Increment supply
    self.total_supply += 1;
    let token_id = self.total_supply;
    
    // Create reputation data
    let reputation = ReputationData {
        score,
        profile,
        stellar_address,
        minted_at: self.env().block_timestamp(),
        token_id,
    };
    
    // Store data
    self.reputation_data.insert(&caller, &reputation);
    
    // Emit event
    self.env().emit_event(SBTMinted {
        owner: caller,
        token_id,
        score,
    });
    
    Ok(token_id)
}
```

#### 3. Get Reputation
```rust
#[ink(message)]
pub fn get_reputation(&self, account: AccountId) -> Option<ReputationData> {
    self.reputation_data.get(&account)
}
```

#### 4. Verify Ownership
```rust
#[ink(message)]
pub fn verify_ownership(&self, account: AccountId) -> bool {
    self.reputation_data.contains(&account)
}
```

#### 5. Update Score
```rust
#[ink(message)]
pub fn update_score(&mut self, new_score: u32) -> Result<()> {
    let caller = self.env().caller();
    
    // Validate score
    if new_score > 1000 {
        return Err(Error::InvalidScore);
    }
    
    // Get existing reputation
    let mut reputation = self.reputation_data
        .get(&caller)
        .ok_or(Error::NotFound)?;
    
    let old_score = reputation.score;
    reputation.score = new_score;
    
    // Update storage
    self.reputation_data.insert(&caller, &reputation);
    
    // Emit event
    self.env().emit_event(ScoreUpdated {
        owner: caller,
        old_score,
        new_score,
    });
    
    Ok(())
}
```

#### 6. Get Total Supply
```rust
#[ink(message)]
pub fn total_supply(&self) -> u64 {
    self.total_supply
}
```

#### 7. Transfer Prevention (CRITICAL)
```rust
// NO TRANSFER FUNCTION
// SBTs are soulbound and cannot be transferred
// Any attempt to add a transfer function should be rejected
```

### Events

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

### Build & Deploy Commands

```bash
# Navigate to contract directory
cd polkadot-reputation

# Build contract
cargo contract build --release

# Deploy to Rococo Contracts parachain
cargo contract instantiate \
  --constructor new \
  --suri //Alice \
  --url wss://rococo-contracts-rpc.polkadot.io \
  --execute

# Alternative: Use Contracts UI
# 1. Go to https://contracts-ui.substrate.io/
# 2. Connect to Rococo Contracts
# 3. Upload contract WASM
# 4. Instantiate with constructor
```

### Frontend Integration

```typescript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromAddress } from '@polkadot/extension-dapp';

// Initialize API
const wsProvider = new WsProvider('wss://rococo-contracts-rpc.polkadot.io');
const api = await ApiPromise.create({ provider: wsProvider });

// Initialize contract
const contract = new ContractPromise(api, ABI, CONTRACT_ADDRESS);

// Mint SBT
async function mintSBT(
  account: string,
  score: number,
  profile: string,
  stellarAddress: string
) {
  const injector = await web3FromAddress(account);
  
  const gasLimit = api.registry.createType('WeightV2', {
    refTime: 1000000000,
    proofSize: 1000000,
  });
  
  const { result, output } = await contract.tx
    .mintSbt({ gasLimit, storageDepositLimit: null }, score, profile, stellarAddress)
    .signAndSend(account, { signer: injector.signer });
  
  return result;
}

// Get reputation
async function getReputation(account: string) {
  const { result, output } = await contract.query.getReputation(
    account,
    { gasLimit: -1 },
    account
  );
  
  if (output) {
    return output.toHuman();
  }
  return null;
}
```

---

## Cross-Chain Verification

### Verification Flow

1. **User mints credential on Stellar**
   - Stellar contract stores reputation data
   - Event emitted with user address and score

2. **User mints SBT on Polkadot**
   - Polkadot contract mints non-transferable token
   - Links to Stellar address
   - Event emitted with token ID

3. **Verification**
   - Query both contracts
   - Verify scores match
   - Verify addresses are linked
   - Confirm both credentials exist

### Verification Function (Backend)

```typescript
async function verifyCredential(
  stellarAddress: string,
  polkadotAddress: string
): Promise<VerificationResult> {
  // Check Stellar
  const stellarData = await getStellarReputation(stellarAddress);
  
  // Check Polkadot
  const polkadotData = await getPolkadotReputation(polkadotAddress);
  
  // Verify both exist
  const stellarExists = stellarData !== null;
  const polkadotExists = polkadotData !== null;
  
  // Verify scores match (within tolerance)
  const scoresMatch = stellarExists && polkadotExists &&
    Math.abs(stellarData.score - polkadotData.score) <= 10;
  
  // Verify addresses are linked
  const addressesLinked = stellarExists && polkadotExists &&
    stellarData.polkadot_address === polkadotAddress &&
    polkadotData.stellar_address === stellarAddress;
  
  return {
    verified: stellarExists && polkadotExists && scoresMatch && addressesLinked,
    stellar: stellarExists,
    polkadot: polkadotExists,
    scoresMatch,
    addressesLinked,
  };
}
```

---

## Testing Contracts

### Stellar Contract Tests

```bash
# Run tests
cargo test

# Test specific function
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <SECRET_KEY> \
  --rpc-url https://rpc-futurenet.stellar.org \
  -- get_reputation \
  --user <USER_ADDRESS>
```

### Polkadot Contract Tests

```bash
# Run unit tests
cargo test

# Run integration tests
cargo contract test
```

### Manual Testing Checklist

**Stellar Contract:**
- [ ] Deploy contract successfully
- [ ] Initialize with admin
- [ ] Store reputation data
- [ ] Retrieve reputation data
- [ ] Update score
- [ ] Verify credential
- [ ] Check events are emitted

**Polkadot Contract:**
- [ ] Deploy contract successfully
- [ ] Mint SBT
- [ ] Retrieve reputation data
- [ ] Verify ownership
- [ ] Update score
- [ ] Confirm SBT is non-transferable
- [ ] Check events are emitted

**Cross-Chain:**
- [ ] Mint on both chains
- [ ] Verify data consistency
- [ ] Confirm addresses are linked
- [ ] Test verification function

---

## Contract Addresses (Update After Deployment)

```bash
# Stellar Soroban Contract
STELLAR_CONTRACT_ID=<DEPLOYED_CONTRACT_ID>
STELLAR_NETWORK=futurenet
STELLAR_RPC=https://rpc-futurenet.stellar.org

# Polkadot Ink! Contract
POLKADOT_CONTRACT_ADDRESS=<DEPLOYED_CONTRACT_ADDRESS>
POLKADOT_NETWORK=rococo-contracts
POLKADOT_RPC=wss://rococo-contracts-rpc.polkadot.io
```

---

## Security Considerations

### Stellar Contract
- ✅ User authentication required for storing/updating
- ✅ Score validation (0-1000 range)
- ✅ Timestamp tracking for audit trail
- ✅ Events for transparency

### Polkadot Contract
- ✅ SBTs are non-transferable (no transfer function)
- ✅ One SBT per account (prevent duplicates)
- ✅ Score validation (0-1000 range)
- ✅ Only owner can update their score

### Cross-Chain
- ✅ Address linking prevents impersonation
- ✅ Score consistency verification
- ✅ Dual-chain validation required

---

## Troubleshooting

### Common Issues

**Stellar:**
- **Build fails:** Update soroban-sdk version
- **Deploy fails:** Check testnet funds, verify network
- **Invoke fails:** Verify function signature, check auth

**Polkadot:**
- **Build fails:** Update ink! version, check Rust toolchain
- **Deploy fails:** Check contract size, verify network connection
- **Call fails:** Check gas limit, verify account has funds

**Integration:**
- **Frontend can't call contract:** Verify ABI, check contract address
- **Transaction fails:** Increase gas limit, check wallet connection
- **Data mismatch:** Verify both contracts are updated

---

## Next Steps

1. Deploy both contracts to testnets
2. Test all functions manually
3. Integrate with frontend
4. Verify cross-chain functionality
5. Document contract addresses
6. Prepare for demo
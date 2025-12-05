# Stellar Soroban Smart Contracts: Complete Implementation Guide

## Table of Contents
1. [Introduction to Soroban](#introduction-to-soroban)
2. [Environment Setup](#environment-setup)
3. [Basic Contract Structure](#basic-contract-structure)
4. [Data Types and Storage](#data-types-and-storage)
5. [Contract Development](#contract-development)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Best Practices](#best-practices)
9. [Example: Reputation Contract](#example-reputation-contract)

## Introduction to Soroban

Soroban is Stellar's smart contract platform that allows developers to write and deploy smart contracts using Rust. It runs on the Stellar network and uses WebAssembly (WASM) as its compilation target. Soroban contracts are designed to be secure, efficient, and developer-friendly.

### Key Features
- **Rust-based**: Uses the Rust programming language for safety and performance
- **WASM compilation**: Contracts compile to WebAssembly for security
- **On-chain execution**: Runs on the Stellar blockchain network
- **Cost-effective**: Designed for low transaction fees
- **Scalable**: Handles high throughput of transactions

## Environment Setup

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### 2. Add WASM Target
```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install Stellar CLI
```bash
cargo install --locked stellar-cli
```

### 4. Add Soroban Testnet
```bash
stellar network add --global testnet --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015"
```

### 5. Install Soroban CLI (Alternative to stellar-cli)
```bash
cargo install --locked --version 20.0.0 soroban-cli
```

## Basic Contract Structure

Every Soroban contract follows a standard structure:

### 1. Essential Crates
```rust
#![no_std]  // Critical: Reduces contract size by excluding standard library

use soroban_sdk::{
    contract,           // Main contract attribute
    contractimpl,       // Contract implementation attribute
    contracttype,       // For custom types in contracts
    symbol_short,       // For efficient short string identifiers
    vec,                // Vector type
    Env,                // Environment object
    String,             // String type
    Vec,                // Vector type for collections
    Address,            // Address type
    Map,                // Key-value mapping
};
```

### 2. Contract Definition Pattern
```rust
#[contract]
pub struct ContractName;

#[contractimpl]
impl ContractName {
    // Constructor (optional)
    pub fn initialize(env: Env) -> bool {
        // Initialization logic
        true
    }
    
    // Public functions that can be called externally
    pub fn function_name(env: Env, param: String) -> String {
        // Function logic
        param
    }
}
```

## Data Types and Storage

### Built-in Data Types
- **`Symbol`**: Efficient short string identifiers (≤32 characters)
- **`String`**: Longer text data
- **`Address`**: Stellar addresses
- **`i32, u32, i64, u64`**: Integer types
- **`bool`**: Boolean values
- **`Vec<T>`**: Growable arrays
- **`Map<K, V>`**: Key-value stores
- **`Bytes`**: Raw binary data

### Storage Types
Soroban provides three types of persistent storage:

#### 1. Instance Storage
- Associated with the contract instance
- Exists for the lifetime of the contract
- Use for contract-level state

```rust
pub fn initialize(env: Env, admin: Address) {
    env.storage().instance().set(&symbol_short!("admin"), &admin);
}

pub fn get_admin(env: Env) -> Address {
    env.storage().instance().get(&symbol_short!("admin")).unwrap()
}
```

#### 2. Persistent Storage
- Individual key-value pairs
- Exists until explicitly deleted
- Use for user-specific data

```rust
pub fn set_user_data(env: Env, user: Address, data: String) {
    user.require_auth(); // Require user authentication
    env.storage().persistent().set(&user, &data);
}

pub fn get_user_data(env: Env, user: Address) -> Option<String> {
    env.storage().persistent().get(&user)
}
```

#### 3. Temporary Storage
- Short-lived data (about 80 seconds)
- Lower cost than persistent storage
- Use for temporary values

```rust
pub fn set_temp_data(env: Env, key: Symbol, value: String) {
    env.storage().temporary().set(&key, &value);
}
```

## Contract Development

### 1. Custom Types with `#[contracttype]`
```rust
#[contracttype]
pub struct UserData {
    pub balance: i64,
    pub name: String,
    pub created_at: u64,
}

#[contracttype]
pub enum Status {
    Active = 1,
    Inactive = 2,
    Suspended = 3,
}
```

### 2. Error Handling
```rust
#[contracttype]
pub enum Error {
    NotAuthorized = 1,
    InsufficientFunds = 2,
    UserNotFound = 3,
}

impl IntoVal<Env, RawVal> for Error {
    fn into_val(&self, env: &Env) -> RawVal {
        (*self as u32).into_val(env)
    }
}

pub fn transfer(env: Env, from: Address, to: Address, amount: i64) -> Result<(), Error> {
    from.require_auth();
    
    if amount <= 0 {
        return Err(Error::InsufficientFunds);
    }
    
    // Transfer logic here
    Ok(())
}
```

### 3. Events
```rust
pub fn emit_transfer_event(env: Env, from: Address, to: Address, amount: i64) {
    env.events()
        .publish((symbol_short!("transfer"), from.clone(), to.clone()), amount);
}
```

### 4. Authentication
```rust
pub fn protected_function(env: Env, user: Address, data: String) -> String {
    user.require_auth(); // Requires user signature
    env.storage().persistent().set(&user, &data);
    data
}
```

## Testing

Soroban provides a comprehensive testing framework:

### 1. Basic Test Structure
```rust
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, Address, String};

    #[test]
    fn test_basic_function() {
        let env = Env::default();
        let contract_id = env.register_contract(None, Contract {});
        let client = ContractClient::new(&env, &contract_id);
        
        let result = client.hello(&String::from_str(&env, "World"));
        assert_eq!(result, vec![&env, String::from_str(&env, "Hello"), String::from_str(&env, "World")]);
    }
}
```

### 2. Testing with Mocked Addresses
```rust
#[test]
fn test_with_addresses() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract {});
    let client = ContractClient::new(&env, &contract_id);
    
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    
    // Test authentication
    env.mock_all_auths();
    client.protected_function(&user1, &String::from_str(&env, "test"));
}
```

### 3. Testing Storage
```rust
#[test]
fn test_storage() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract {});
    let client = ContractClient::new(&env, &contract_id);
    
    let user = Address::generate(&env);
    let data = String::from_str(&env, "test_data");
    
    env.mock_all_auths();
    client.set_user_data(&user, &data);
    
    let result = client.get_user_data(&user);
    assert_eq!(result, Some(data));
}
```

## Deployment

### 1. Building the Contract
```bash
# Build for deployment
cargo build --target wasm32-unknown-unknown --release

# Or using soroban CLI
soroban contract build
```

### 2. Deploying to Testnet
```bash
# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/contract_name.wasm \
  --source ACCOUNT_SECRET_KEY \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Initialize the contract
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  --initialize \
  --arg "initialize_args"
```

### 3. Interacting with Deployed Contract
```bash
# Call functions on deployed contract
soroban contract invoke \
  --id CONTRACT_ID \
  --source ACCOUNT_SECRET_KEY \
  -- hello \
  --arg "World"
```

## Best Practices

### 1. Code Optimization
- Use `Symbol` instead of `String` when possible (max 32 chars)
- Use `symbol_short!` macro for compile-time symbols
- Keep contract size under 64KB for efficiency
- Use appropriate integer types to save space

### 2. Security
- Always call `require_auth()` for sensitive operations
- Validate all inputs before processing
- Check for integer overflow/underflow
- Use proper access controls

### 3. Testing
- Write comprehensive unit tests
- Test edge cases and error conditions
- Use mock authentication in tests
- Test both success and failure paths

## Example: Reputation Contract

Here's a complete example of a reputation tracking contract:

```rust
#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Env, String, Vec, Address, Map,
};

#[contracttype]
pub struct ReputationData {
    pub score: u32,
    pub profile: String,
    pub polkadot_address: String,
    pub timestamp: u64,
    pub verified: bool,
}

#[contracttype]
pub enum Error {
    NotAuthorized = 1,
    InvalidScore = 2,
    NotFound = 3,
}

#[contract]
pub struct ReputationRegistry;

#[contractimpl]
impl ReputationRegistry {
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        Ok(())
    }

    pub fn store_reputation(
        env: Env,
        user: Address,
        score: u32,
        profile: String,
        polkadot_address: String,
    ) -> Result<(), Error> {
        user.require_auth();

        if score > 1000 {
            return Err(Error::InvalidScore);
        }

        let reputation = ReputationData {
            score,
            profile,
            polkadot_address,
            timestamp: env.ledger().timestamp(),
            verified: true,
        };

        env.storage().persistent().set(&user, &reputation);

        env.events().publish(
            (symbol_short!("reputation_stored"), user.clone()),
            (score, env.ledger().timestamp()),
        );

        Ok(())
    }

    pub fn get_reputation(
        env: Env,
        user: Address,
    ) -> Option<ReputationData> {
        env.storage().persistent().get(&user)
    }

    pub fn update_score(
        env: Env, 
        user: Address,
        new_score: u32,
    ) -> Result<(), Error> {
        user.require_auth();

        if new_score > 1000 {
            return Err(Error::InvalidScore);
        }

        let mut reputation = env
            .storage()
            .persistent()
            .get::<Address, ReputationData>(&user)
            .ok_or(Error::NotFound)?;

        let old_score = reputation.score;
        reputation.score = new_score;
        reputation.timestamp = env.ledger().timestamp();

        env.storage().persistent().set(&user, &reputation);

        env.events().publish(
            (symbol_short!("score_updated"), user.clone()),
            (old_score, new_score),
        );

        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, Address, String};

    #[test]
    fn test_store_reputation() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ReputationRegistry);
        let client = ReputationRegistryClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let score = 750u32;
        let profile = String::from_str(&env, "Balanced");
        let polkadot_addr = String::from_str(&env, "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");

        env.mock_all_auths();
        client.store_reputation(&user, &score, &profile, &polkadot_addr);

        let result = client.get_reputation(&user).unwrap();
        assert_eq!(result.score, score);
        assert_eq!(result.verified, true);
    }
}
```

This guide provides everything needed to start developing Soroban smart contracts, from basic setup to advanced features and best practices.
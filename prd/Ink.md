# Ink! Smart Contracts: Complete Implementation Guide

## Table of Contents
1. [Introduction to Ink!](#introduction-to-ink)
2. [Environment Setup](#environment-setup)
3. [Basic Contract Structure](#basic-contract-structure)
4. [Data Types and Storage](#data-types-and-storage)
5. [Contract Development](#contract-development)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Best Practices](#best-practices)
9. [Example: Reputation SBT Contract](#example-reputation-sbt-contract)

## Introduction to Ink!

Ink! (pronounced "ink") is an embedded domain-specific language (eDSL) that allows developers to write secure WebAssembly-based smart contracts for blockchains built on the Substrate framework. It's part of the Polkadot ecosystem and uses the Rust programming language.

### Key Features
- **Rust-based**: Leverages Rust's safety and performance
- **WebAssembly**: Compiles to WASM for secure execution
- **Substrate Integration**: Works with any Substrate-based chain
- **Gas-efficient**: Optimized for minimal gas consumption
- **Feature-rich**: Supports complex smart contract logic

## Environment Setup

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustup default stable
```

### 2. Add WASM Target
```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install cargo-contract
```bash
cargo install cargo-contract --force
```

### 4. Verify Installation
```bash
cargo contract --version
```

## Basic Contract Structure

Every Ink! contract follows a specific structure with essential attributes:

### 1. Essential Imports and Configuration
```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod contract_name {
    // Contract code goes here
}
```

### 2. Critical Configuration Explanation
- `#![cfg_attr(not(feature = "std"), no_std, no_main)]`: Critical for contracts to work without standard library
- `#[ink::contract]`: Main macro that marks the contract module
- Everything inside this module is part of the contract

### 3. Contract Definition Pattern
```rust
#[ink::contract]
mod my_contract {
    use ink::prelude::vec::Vec;  // For collections
    use ink::storage::Mapping;   // For key-value storage
    
    #[ink(storage)]
    pub struct MyContract {
        // Storage fields go here
        owner: AccountId,
        counter: u32,
    }

    #[ink(constructor)]
    pub fn new() -> Self {
        // Constructor logic
        Self {
            owner: Self::env().caller(),
            counter: 0,
        }
    }

    #[ink(message)]
    pub fn do_something(&self) -> u32 {
        // Read-only function
        self.counter
    }

    #[ink(message)]
    pub fn modify_something(&mut self) {
        // Mutable function
        self.counter += 1;
    }
}
```

## Data Types and Storage

### 1. Essential Data Types in Ink!

#### Built-in Types
- **`AccountId`**: Represents a Substrate account
- **`Balance`**: Represents a monetary amount
- **`BlockNumber`**: Represents a block number
- **`Hash`**: Represents a hash value
- **`Timestamp`**: Represents timestamp

#### Collection Types
- **`Mapping<K, V>`**: Key-value storage
- **`Lazy<T>`**: Lazy-loaded storage item
- **`StorageVec<T>`**: Vector in storage

### 2. Storage Management

#### Storage Attributes
```rust
#[ink(storage)]
pub struct MyContract {
    // Simple storage
    counter: u32,
    
    // Mapping storage (like a hash map)
    balances: Mapping<AccountId, Balance>,
    
    // Lazy storage (loaded on demand)
    large_data: Lazy<Vec<u8>>,
    
    // Storage vector
    items: StorageVec<String>,
}
```

#### Storage Operations
```rust
impl MyContract {
    #[ink(constructor)]
    pub fn new() -> Self {
        let mut balances = Mapping::default();
        let mut items = StorageVec::new();
        
        // Initialize storage
        balances.insert(&Self::env().caller(), &1000);
        items.push(&String::from("item1"));
        
        Self {
            counter: 0,
            balances,
            large_data: Lazy::new(Vec::new()),
            items,
        }
    }
    
    #[ink(message)]
    pub fn get_balance(&self, account: AccountId) -> Option<Balance> {
        self.balances.get(&account)
    }
    
    #[ink(message)]
    pub fn set_balance(&mut self, account: AccountId, amount: Balance) {
        self.balances.insert(&account, &amount);
    }
}
```

## Contract Development

### 1. Constructor Functions
Constructor functions initialize the contract state and are called when the contract is deployed.

```rust
#[ink(constructor)]
pub fn new(initial_counter: u32) -> Self {
    // Access caller's AccountId
    let caller = Self::env().caller();
    
    // Get current block number
    let block_number = Self::env().block_number();
    
    // Create contract instance
    Self {
        owner: caller,
        counter: initial_counter,
        creation_block: block_number,
    }
}

// Multiple constructors allowed
#[ink(constructor)]
pub fn default() -> Self {
    Self::new(0)  // Delegating to another constructor
}
```

### 2. Message Functions
Message functions can be called by external accounts or other contracts.

```rust
// Read-only message (doesn't modify state)
#[ink(message)]
pub fn get_counter(&self) -> u32 {
    self.counter
}

// Mutable message (modifies state)
#[ink(message)]
pub fn increment(&mut self) {
    self.counter += 1;
}

// Message with parameters
#[ink(message)]
pub fn set_counter(&mut self, new_value: u32) {
    // Access caller
    let caller = Self::env().caller();
    
    // Access contract owner
    let owner = self.owner;
    
    // Only owner can set counter
    assert_eq!(caller, owner, "Only owner can set counter");
    
    self.counter = new_value;
}

// Message that returns complex types
#[ink(message)]
pub fn get_info(&self) -> (u32, AccountId) {
    (self.counter, self.owner)
}
```

### 3. Error Handling

#### Defining Error Types
```rust
#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum Error {
    // Business logic errors
    InsufficientBalance,
    NotOwner,
    AlreadyExists,
    Unauthorized,
    
    // Common errors from pallet-contracts
    #[cfg(feature = "std")]
    #[codec(skip)]
    CouldNotReadInput,
}

pub type Result<T> = core::result::Result<T, Error>;
```

#### Using Errors in Functions
```rust
#[ink(message)]
pub fn transfer(&mut self, to: AccountId, amount: Balance) -> Result<()> {
    let caller = Self::env().caller();
    
    // Check sufficient balance
    let caller_balance = self.balances.get(&caller).unwrap_or(0);
    if caller_balance < amount {
        return Err(Error::InsufficientBalance);
    }
    
    // Update balances
    self.balances.insert(&caller, &(caller_balance - amount));
    let to_balance = self.balances.get(&to).unwrap_or(0);
    self.balances.insert(&to, &(to_balance + amount));
    
    // Emit event
    self.env().emit_event(Transfer {
        from: caller,
        to,
        value: amount,
    });
    
    Ok(())
}
```

### 4. Events
Events allow off-chain applications to monitor contract activity.

```rust
// Define event structure
#[ink(event)]
pub struct Transfer {
    #[ink(topic)]  // Topics are indexed for easier querying
    from: AccountId,
    #[ink(topic)]
    to: AccountId,
    value: Balance,
}

#[ink(event)]
pub struct Approval {
    #[ink(topic)]
    owner: AccountId,
    #[ink(topic)]
    spender: AccountId,
    value: Balance,
}

// Emit events in functions
#[ink(message)]
pub fn transfer(&mut self, to: AccountId, amount: Balance) -> Result<()> {
    let from = Self::env().caller();
    
    // ... transfer logic ...
    
    // Emit event
    self.env().emit_event(Transfer {
        from,
        to,
        value: amount,
    });
    
    Ok(())
}
```

### 5. Environment Access

#### Common Environment Functions
```rust
impl MyContract {
    #[ink(message)]
    pub fn get_environment_info(&self) -> (AccountId, BlockNumber, Balance) {
        (
            self.env().caller(),           // Who called this function
            self.env().block_number(),     // Current block number
            self.env().transferred_value(), // Amount of value transferred
        )
    }
    
    #[ink(message)]
    pub fn get_balance_of_contract(&self) -> Balance {
        self.env().balance()  // Balance of this contract
    }
    
    #[ink(message)]
    pub fn get_block_timestamp(&self) -> Timestamp {
        self.env().block_timestamp()  // Current block timestamp
    }
}
```

## Testing

Ink! provides a comprehensive testing framework that runs tests off-chain.

### 1. Basic Test Structure
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[ink::test]
    fn it_works() {
        // Set up the contract
        let contract = MyContract::new(42);
        
        // Perform action
        let result = contract.get_counter();
        
        // Assert result
        assert_eq!(result, 42);
    }
}
```

### 2. Setting Up Test Environment
```rust
#[cfg(test)]
mod tests {
    use super::*;
    use ink::env::test;  // For test utilities
    
    #[ink::test]
    fn test_with_accounts() {
        // Create default accounts
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        let owner = accounts.alice;
        let user = accounts.bob;
        
        // Set caller
        test::set_caller::<ink::env::DefaultEnvironment>(owner);
        
        // Create contract
        let mut contract = MyContract::new(100);
        
        // Test that owner can call restricted functions
        assert_eq!(contract.get_counter(), 100);
    }
}
```

### 3. Testing Error Conditions
```rust
#[ink::test]
fn transfer_insufficient_balance_should_fail() {
    let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
    let mut contract = MyContract::new();
    
    // Set caller to Alice
    test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
    
    // Attempt to transfer more than available balance
    let result = contract.transfer(accounts.bob, 1000);  // If balance is less than 1000
    
    // Assert that error was returned
    assert_eq!(result, Err(Error::InsufficientBalance));
}
```

### 4. Testing Events
```rust
#[ink::test]
fn transfer_should_emit_event() {
    let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
    let mut contract = MyContract::new();
    
    // Set caller
    test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
    
    // Clear recorded events
    ink::env::test::recorded_events().clear();
    
    // Perform transfer
    contract.transfer(accounts.bob, 100).unwrap();
    
    // Get recorded events
    let events = ink::env::test::recorded_events().collect::<Vec<_>>();
    
    // Assert event was emitted
    assert_eq!(events.len(), 1);
    
    // Decode and check event
    let event = events.get(0).unwrap();
    // Additional event verification here...
}
```

## Deployment

### 1. Building the Contract
```bash
# Build the contract
cargo contract build

# Build in release mode
cargo contract build --release

# Build with metadata
cargo contract build --manifest-path ./Cargo.toml
```

### 2. Generating Metadata
```bash
# Generate contract metadata (for UIs and tools)
cargo contract build --release
```

### 3. Deployment Process
```bash
# 1. Instantiate the contract
cargo contract instantiate \
  --constructor new \
  --args arg1 arg2 \
  --suri //Alice \
  --url wss://rococo-contracts-rpc.polkadot.io

# 2. Or use the Contracts UI
# - Go to https://contracts-ui.substrate.io/
# - Connect to a chain (like Rococo)
# - Upload your .contract file
# - Instantiate with constructor
```

### 4. Contract File Structure
After building, you'll get a `.contract` file containing:
- **WASM bytecode**: The compiled contract code
- **Metadata**: Information about functions, events, etc.
- **Package information**: Name, version, authors

## Best Practices

### 1. Performance Optimization
- **Minimize storage reads/writes**: Cache values in memory when possible
- **Use appropriate data types**: Choose between `Mapping`, `Lazy`, `StorageVec` appropriately
- **Optimize for gas**: Reduce computational complexity
- **Batch operations**: Combine multiple operations when possible

### 2. Security Patterns
- **Input validation**: Always validate function parameters
- **Access control**: Implement proper access patterns
- **Integer overflow**: Use checked arithmetic operations
- **Reentrancy**: Be careful with external calls

### 3. Error Handling
- **Define comprehensive error types**: Cover all possible failure scenarios
- **Fail fast**: Return errors early in function execution
- **Provide meaningful error messages**: Help users understand failures

### 4. Code Organization
- **Separate concerns**: Keep storage, logic, and interface separate
- **Use meaningful names**: Make functions and variables self-documenting
- **Document complex logic**: Use comments for non-obvious operations

## Example: Reputation SBT Contract

Here's a complete example of a Soulbound Token contract for reputation:

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

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
        /// Mapping of token owners (SBT ownership)
        token_owners: Mapping<u64, AccountId>,
        /// Account to token ID mapping
        account_tokens: Mapping<AccountId, u64>,
    }

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct ReputationData {
        pub score: u32,           // 0-1000 reputation score
        pub profile: String,      // "Trader", "Governor", "Staker", etc.
        pub stellar_address: String,  // Linked Stellar address
        pub minted_at: u64,       // Block timestamp when minted
        pub token_id: u64,        // Unique SBT identifier
        pub verified: bool,       // Whether credentials verified
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        AlreadyMinted,      // SBT already exists for this account
        NotFound,           // No SBT found for account
        Unauthorized,       // User doesn't have permission
        InvalidScore,       // Score is outside 0-1000 range
        TransferNotAllowed, // Attempted to transfer SBT (not allowed)
    }

    pub type Result<T> = core::result::Result<T, Error>;

    impl ReputationSBT {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                reputation_data: Mapping::default(),
                total_supply: 0,
                owner: Self::env().caller(),
                token_owners: Mapping::default(),
                account_tokens: Mapping::default(),
            }
        }

        /// Mint a new Soulbound Token with reputation data
        #[ink(message)]
        pub fn mint_sbt(
            &mut self,
            score: u32,
            profile: String,
            stellar_address: String,
        ) -> Result<u64> {
            let caller = self.env().caller();

            // Check if already minted (SBTs are non-transferable, so only one per account)
            if self.reputation_data.contains(&caller) {
                return Err(Error::AlreadyMinted);
            }

            // Validate score range
            if score > 1000 {
                return Err(Error::InvalidScore);
            }

            // Increment total supply to create new token ID
            self.total_supply += 1;
            let token_id = self.total_supply;

            // Create reputation data
            let reputation = ReputationData {
                score,
                profile,
                stellar_address,
                minted_at: self.env().block_timestamp(),
                token_id,
                verified: true,
            };

            // Store the reputation data
            self.reputation_data.insert(&caller, &reputation);
            
            // Map token ID to owner
            self.token_owners.insert(&token_id, &caller);
            
            // Map account to token ID
            self.account_tokens.insert(&caller, &token_id);

            // Emit event
            self.env().emit_event(SBTMinted {
                owner: caller,
                token_id,
                score,
            });

            Ok(token_id)
        }

        /// Get reputation data for an account
        #[ink(message)]
        pub fn get_reputation(&self, account: AccountId) -> Option<ReputationData> {
            self.reputation_data.get(&account)
        }

        /// Get account by token ID
        #[ink(message)]
        pub fn owner_of(&self, token_id: u64) -> Option<AccountId> {
            self.token_owners.get(&token_id)
        }

        /// Verify that an account owns a valid SBT
        #[ink(message)]
        pub fn verify_ownership(&self, account: AccountId) -> bool {
            self.reputation_data.contains(&account)
        }

        /// Update score for existing SBT
        #[ink(message)]
        pub fn update_score(&mut self, new_score: u32) -> Result<()> {
            let caller = self.env().caller();

            // Validate score
            if new_score > 1000 {
                return Err(Error::InvalidScore);
            }

            // Get existing reputation data
            let mut reputation = self.reputation_data
                .get(&caller)
                .ok_or(Error::NotFound)?;

            let old_score = reputation.score;
            reputation.score = new_score;
            reputation.minted_at = self.env().block_timestamp();

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

        /// Get total number of SBTs minted
        #[ink(message)]
        pub fn total_supply(&self) -> u64 {
            self.total_supply
        }

        /// Transfer function - BLOCKED for SBTs
        #[ink(message)]
        pub fn transfer(&self, _to: AccountId, _token_id: u64) -> Result<()> {
            // Soulbound tokens cannot be transferred - this function always fails
            Err(Error::TransferNotAllowed)
        }
    }

    /// Events for off-chain monitoring
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
}

#[cfg(test)]
mod tests {
    use super::*;
    use ink::env::test;
    
    #[ink::test]
    fn mint_sbt_works() {
        let mut contract = ReputationSBT::new();
        let score = 750u32;
        let profile = String::from("Balanced");
        let stellar_addr = String::from("GABC123...");
        
        // Set caller
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let result = contract.mint_sbt(score, profile, stellar_addr);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 1); // First token has ID 1
        
        // Verify token was created
        let alice_reputation = contract.get_reputation(accounts.alice).unwrap();
        assert_eq!(alice_reputation.score, 750);
        assert_eq!(alice_reputation.token_id, 1);
    }

    #[ink::test]
    fn transfer_should_fail_for_sbt() {
        let mut contract = ReputationSBT::new();
        let score = 750u32;
        let profile = String::from("Balanced");
        let stellar_addr = String::from("GABC123...");
        
        // Set caller and mint SBT
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        contract.mint_sbt(score, profile, stellar_addr).unwrap();
        
        // Transfer should fail
        let transfer_result = contract.transfer(accounts.bob, 1);
        assert_eq!(transfer_result, Err(Error::TransferNotAllowed));
    }

    #[ink::test]
    fn update_score_works() {
        let mut contract = ReputationSBT::new();
        let initial_score = 750u32;
        let profile = String::from("Balanced");
        let stellar_addr = String::from("GABC123...");
        
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        // Mint SBT
        contract.mint_sbt(initial_score, profile, stellar_addr).unwrap();
        
        // Update score
        let new_score = 800u32;
        let update_result = contract.update_score(new_score);
        assert!(update_result.is_ok());
        
        // Verify score was updated
        let updated_reputation = contract.get_reputation(accounts.alice).unwrap();
        assert_eq!(updated_reputation.score, new_score);
    }
}
```

This comprehensive guide provides everything needed to start developing Ink! smart contracts, from basic setup to advanced features, testing, and deployment patterns.
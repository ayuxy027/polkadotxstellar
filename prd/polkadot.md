POLKADOT DEVELOPMENT: COMPLETE COMPREHENSIVE GUIDE

Created: December 5, 2025
Version: 1.0
Status: Production Ready
Target Audience: Web3 Developers, Blockchain Engineers

---

TABLE OF CONTENTS

1.  INTRODUCTION TO POLKADOT (#introduction-to-polkadot)
2.  POLKADOT ARCHITECTURE (#polkadot-architecture)
3.  PARACHAINS & PARATHREADS (#parachains--parathreads)
4.  SUBSTRATE FRAMEWORK (#substrate-framework)
5.  INK! SMART CONTRACTS (#ink-smart-contracts)
6.  POLKADOT SDK (#polkadot-sdk)
7.  DEVELOPMENT TOOLS (#development-tools)
8.  BUILDING PARACHAINS (#building-parachains)
9.  SMART CONTRACT DEVELOPMENT (#smart-contract-development)
10. DEPLOYMENT & TESTING (#deployment--testing)
11. CROSS-CHAIN MESSAGING (XCM) (#cross-chain-messaging-xcm)
12. SECURITY BEST PRACTICES (#security-best-practices)
13. RESOURCES & REFERENCES (#resources--references)

---

INTRODUCTION TO POLKADOT

What is Polkadot?

Polkadot is a heterogeneous multi-chain framework that enables different blockchains to interoperate and
communicate in a secure, trust-free environment. It's often called the "blockchain of blockchains" as it connects
multiple specialized blockchains into one unified network.

Key Features

- Interoperability: Different blockchains can communicate and share data
- Shared Security: All connected chains benefit from relay chain security
- On-chain Governance: Network upgrades through token holder voting
- Forkless Upgrades: Code can be upgraded without hard forks
- Heterogeneous: Different parachains can have different properties
- Scalability: Multiple chains running in parallel

Use Cases

- DeFi Hubs: Acala, Moonbeam
- Smart Contract Platforms: Astar, Moonbeam
- Data Sharing: Cross-chain data feeds
- Identity: Decentralized identity systems
- Privacy: Zero-knowledge proofs on parachains
- Storage: Distributed storage networks

---

POLKADOT ARCHITECTURE

Core Components

    1 ┌─────────────────────────────────────────────────────────────┐
    2 │                Polkadot Relay Chain                         │
    3 │  (Provides consensus, shared security, governance)         │
    4 └─────────────────────────────────────────────────────────────┘
    5                     │
    6         ┌───────────┼───────────┐
    7         │           │           │
    8 ┌───────▼─────┐ ┌───▼───┐ ┌───▼──────┐
    9 │ Parachain 1 │ │ Parachain 2 │ │ Parachain 3 │

10 │ (Smart │ │ (DeFi) │ │ (Identity) │
11 │ Contracts) │ │ │ │ │
12 └─────────────┘ └────────┘ └──────────┘
13 │
14 ┌───────────▼───────────┐
15 │ Parathread (Pay-per-use) │
16 │ (Storage) │
17 └───────────────────────┘

The Relay Chain

The relay chain is the central chain of the Polkadot network, responsible for:

- Consensus: Maintaining the network's security through Nominated Proof-of-Stake (NPoS)
- Validation: Ensuring all parachains follow the rules
- Finality: Providing deterministic finality for all connected chains
- Cross-chain Messaging: Managing communication between parachains

Nominated Proof-of-Stake (NPoS)

1 Stakers (Nominators) → Stake → Validators
2 Validators → Validate → Parachains
3 Validators → Verify → Block Production

Roles:

- Nominators: Stake tokens to support validators
- Validators: Validate blocks and produce new blocks
- Collators: Maintain parachains by collecting transactions
- Fishermen: Monitor network for malicious activity

---

PARACHAINS & PARATHREADS

Parachains

Parachains are independent blockchains that are connected to the Polkadot relay chain and benefit from its shared
security.

Characteristics:

- Connected permanently to relay chain
- Shared security from relay chain
- Higher throughput than parathreads
- More expensive to operate
- Deterministic finality

Parathreads

Parathreads are pay-per-use blockchains that connect to Polkadot.

Characteristics:

- Pay-per-block connection to relay chain
- More flexible than parachains
- Lower cost for usage
- Less frequent block production
- Suitable for low-traffic applications

Parachain Slot Auctions

To become a parachain, projects must win an auction for a parachain slot:

1 1. Participate in crowdloan → Raise DOT tokens
2 2. Bid in auction → Lock tokens for lease period
3 3. Win auction → Deploy parachain
4 4. Lease expires → Tokens returned

---

SUBSTRATE FRAMEWORK

What is Substrate?

Substrate is Polkadot's blockchain development framework written in Rust. It provides a modular, flexible way to
build blockchains.

Substrate Architecture

    1 ┌─────────────────────────────────────┐
    2 │           Runtime                   │
    3 │  (Business Logic, Pallets)          │
    4 ├─────────────────────────────────────┤
    5 │        Core Components              │
    6 │  • Block Builder                    │
    7 │  • Transaction Queue               │
    8 │  • Consensus                       │
    9 │  • Networking                      │

10 └─────────────────────────────────────┘
11 │
12 ┌───────────▼───────────┐
13 │ Client/Node │
14 │ (Blockchain Client) │
15 └───────────────────────┘

Core Components

1.  Runtime: Contains business logic (pallets)
2.  Client: Manages blockchain state
3.  Consensus: Block production and validation
4.  Networking: P2P communication layer
5.  RPC: Remote procedure call interface

Pallets

Pallets are modular components that implement specific functionality.

Common Pallets:

- pallet-balances: Token balances
- pallet-timestamp: Block timestamps
- pallet-vesting: Token vesting
- pallet-contracts: Smart contract functionality
- pallet-democracy: Governance functionality

---

INK! SMART CONTRACTS

Introduction

ink! is a Rust-based domain-specific language (DSL) for writing WebAssembly smart contracts that run on
Substrate-based blockchains.

Why ink!?

- Memory Safety: Rust prevents entire classes of vulnerabilities
- Performance: WebAssembly bytecode is efficient
- Developer Experience: Leverage Rust ecosystem
- Platform Independence: Runs in Wasm sandbox
- Code Reusability: Standard Rust dependencies

Basic ink! Contract Structure

    1 #![cfg_attr(not(feature = "std"), no_std, no_main)]
    2
    3 #[ink::contract]
    4 mod my_contract {
    5     // Storage
    6     #[ink(storage)]
    7     pub struct MyContract {
    8         value: u32,
    9         owner: AccountId,

10 balances: Mapping<AccountId, Balance>,
11 }
12
13 // Events
14 #[ink(event)]
15 pub struct Transfer {
16 #[ink(topic)]
17 from: Option<AccountId>,
18 #[ink(topic)]
19 to: Option<AccountId>,
20 value: Balance,
21 }
22
23 // Errors
24 #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
25 #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
26 pub enum Error {
27 InsufficientBalance,
28 InvalidRecipient,
29 }
30
31 // Implementation
32 impl MyContract {
33 // Constructor
34 #[ink(constructor)]
35 pub fn new(initial_value: u32) -> Self {
36 Self {
37 value: initial_value,
38 owner: Self::env().caller(),
39 balances: Mapping::default(),
40 }
41 }
42
43 // Message functions (public API)
44 #[ink(message)]
45 pub fn get_value(&self) -> u32 {
46 self.value
47 }
48
49 #[ink(message)]
50 pub fn set_value(&mut self, new_value: u32) {
51 self.value = new_value;
52 }
53
54 #[ink(message)]
55 pub fn transfer(&mut self, to: AccountId, value: Balance) -> Result<(), Error> {
56 let from_balance = self.balances.get(self.env().caller()).unwrap_or(0);
57  
 58 if from_balance < value {
59 return Err(Error::InsufficientBalance);
60 }
61
62 let to_balance = self.balances.get(&to).unwrap_or(0);
63  
 64 self.balances.insert(self.env().caller(), &(from_balance - value));
65 self.balances.insert(&to, &(to_balance + value));
66
67 self.env().emit_event(Transfer {
68 from: Some(self.env().caller()),
69 to: Some(to),
70 value,
71 });
72
73 Ok(())
74 }
75 }
76 }

ink! Development Workflow

1 1. Write Contract → Rust code with #[ink(...)] macros
2 2. Compile Contract → cargo contract build
3 3. Deploy Contract → Through UI or API
4 4. Interact → Send transactions/calls

Storage Patterns in ink!

Simple Storage:

1 #[ink(storage)]
2 pub struct SimpleContract {
3 value: u32,
4 }

Mapping Storage:

1 #[ink(storage)]
2 pub struct TokenContract {
3 balances: Mapping<AccountId, Balance>,
4 allowances: Mapping<(AccountId, AccountId), Balance>,
5 }

Complex Storage:

1 #[ink(storage)]
2 pub struct ComplexContract {
3 users: Mapping<AccountId, User>,
4 votes: Mapping<(AccountId, u32), bool>,
5 counters: Vec<u32>,
6 }

Cross-Contract Calls

    1 #[ink::contract]
    2 mod caller {
    3     use ink::env::call::{build_call, ExecutionInput, Selector};
    4
    5     #[ink(storage)]
    6     pub struct CallerContract {
    7         value: u32,
    8     }
    9

10 impl CallerContract {
11 #[ink(constructor)]
12 pub fn new() -> Self {
13 Self { value: 0 }
14 }
15
16 #[ink(message)]
17 pub fn call_other_contract(&self, other: AccountId) -> u32 {
18 // Call another contract's method
19 build_call::<ink::env::DefaultEnvironment>()
20 .call(other)
21 .exec_input(ExecutionInput::new(Selector::new([0x00, 0x00, 0x00, 0x00])))
22 .returns::<u32>()
23 .fire()
24 .expect("Cross-contract call failed")
25 }
26 }
27 }

---

POLKADOT SDK

Overview

The Polkadot SDK is the comprehensive development toolkit for building on Polkadot, combining Substrate and the
Polkadot runtime.

Polkadot SDK Components

    1 ┌─────────────────────────────────────┐
    2 │          Polkadot SDK               │
    3 ├─────────────────────────────────────┤
    4 │  ┌──────────────────────────────┐   │
    5 │  │         Substrate            │   │
    6 │  │  (Blockchain Framework)      │   │
    7 │  └──────────────────────────────┘   │
    8 │  ┌──────────────────────────────┐   │
    9 │  │      Polkadot Runtime        │   │

10 │ │ (Relay Chain Logic) │ │
11 │ └──────────────────────────────┘ │
12 └─────────────────────────────────────┘

Setting Up Development Environment

Prerequisites:

- Rust (latest stable)
- Git
- Basic command-line tools

Installation:

1 # Install Rust
2 curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
3 source ~/.cargo/env
4
5 # Install WASM target
6 rustup target add wasm32-unknown-unknown
7
8 # Install Substrate CLI
9 cargo install subxt-cli --locked

---

DEVELOPMENT TOOLS

Essential Tools

1.  Polkadot.js Apps: Web UI for interacting with Polkadot networks
2.  Substrate Node Template: Quick start for building Substrate-based chains
3.  ink! CLI: For developing ink! smart contracts
4.  Frontier: For EVM compatibility on Substrate chains
5.  XCM Simulator: For testing cross-chain messages

Polkadot.js API

JavaScript library for interacting with Polkadot/Substrate chains:

    1 import { ApiPromise, WsProvider } from '@polkadot/api';
    2
    3 // Connect to Polkadot network
    4 const provider = new WsProvider('wss://rpc.polkadot.io');
    5 const api = await ApiPromise.create({ provider });
    6
    7 // Query chain state
    8 const chain = await api.rpc.system.chain();
    9 const lastHeader = await api.rpc.chain.getHeader();

10
11 console.log(`Connected to chain ${chain}`);
12 console.log(`Last block: #${lastHeader.number}`);
13
14 // Submit extrinsic
15 const unsub = await api.tx.balances.transfer('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', 12345)
16 .signAndSend(alice, ({ events, status }) => {
17 console.log(`Status: ${status.type}`);
18  
 19 if (status.isFinalized) {
20 console.log(`Transaction included at blockHash ${status.asFinalized}`);
21 events.forEach(({ phase, event: { data, method, section } }) => {
22 console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
23 });
24 unsub();
25 }
26 });

Polkadot CLI

Command-line interface for Polkadot development:

1 # Generate key pairs
2 polkadot key generate --scheme sr25519
3
4 # Convert addresses
5 polkadot key ss58 --to 5FHneW46xGXgs5mUiveU4sEozHV8CvGybLJCw1D6jq6rTL5F
6
7 # Verify signatures
8 polkadot key verify $signature $data $address

---

BUILDING PARACHAINS

Creating a Basic Parachain

Step 1: Set up the node template

1 # Clone the Substrate node template
2 git clone -b polkadot-v1.0.0 https://github.com/paritytech/polkadot-sdk.git
3 cd polkadot-sdk/substrate/bin/node-template

Step 2: Define your runtime

     1 // runtime/src/lib.rs
     2 #![cfg_attr(not(feature = "std"), no_std)]
     3 // `construct_runtime!` does a lot of recursion and requires us to increase the limit.
     4 #![recursion_limit = "512"]
     5
     6 use frame_support::{
     7     construct_runtime, parameter_types, traits::{KeyOwnerProofSystem, Randomness},
     8     weights::{
     9         constants::{BlockExecutionWeight, ExtrinsicBaseWeight, RocksDbWeight,
       WEIGHT_REF_TIME_PER_SECOND},
    10         IdentityFee, Weight,
    11     },
    12     dispatch::DispatchClass,
    13 };
    14 use frame_system::{
    15     limits::{BlockLength, BlockWeights},
    16     EnsureRoot
    17 };
    18 use sp_runtime::{Perbill, traits::{AccountIdLookup, BlakeTwo256, Block as BlockT}};
    19 use sp_std::prelude::*;
    20
    21 pub use pallet_balances::Call as BalancesCall;
    22
    23 #[cfg(any(feature = "std", test))]
    24 pub use sp_runtime::BuildStorage;
    25
    26 // A few exports that help ease life for downstream crates.
    27 pub use frame_support::{
    28     construct_runtime, parameter_types, traits::{Get, KeyOwnerProofSystem, Randomness},
    29     weights::{
    30         constants::{BlockExecutionWeight, ExtrinsicBaseWeight, RocksDbWeight,
       WEIGHT_REF_TIME_PER_SECOND},
    31         IdentityFee, Weight,
    32     },
    33     dispatch::DispatchClass,
    34 };
    35 pub use frame_system::Call as SystemCall;
    36 pub use pallet_timestamp::Call as TimestampCall;
    37
    38 // Import the template pallet.
    39 pub use template_pallet;
    40
    41 /// An index to a block.
    42 pub type BlockNumber = u32;
    43
    44 /// Alias to 512-bit hash when used in the context of a transaction signature on the chain.
    45 pub type Signature = sp_runtime::MultiSignature;
    46
    47 /// Some way of identifying an account on the chain. We intentionally make it equivalent
    48 /// to the public key of our transaction signing scheme.
    49 pub type AccountId = <<Signature as sp_runtime::traits::Verify>::Signer as
       sp_runtime::traits::IdentifyAccount>::AccountId;
    50
    51 /// Balance of an account.
    52 pub type Balance = u128;
    53
    54 /// Index of a transaction in the chain.
    55 pub type Index = u32;
    56
    57 /// A hash of some data used by the chain.
    58 pub type Hash = sp_core::H256;
    59
    60 /// Opaque types. These are used by the CLI to instantiate machinery that don't need to know
    61 /// the specifics of the runtime. They can then be made to be agnostic over specific formats
    62 /// of data like extrinsics, allowing for them to continue syncing the network through upgrades
    63 /// to even the core data structures.
    64 pub mod opaque {
    65     use super::*;
    66
    67     pub use sp_runtime::OpaqueExtrinsic as UncheckedExtrinsic;
    68
    69     /// Opaque block header type.
    70     pub type Header = sp_runtime::generic::Header<BlockNumber, BlakeTwo256>;
    71     /// Opaque block type.
    72     pub type Block = sp_runtime::generic::Block<Header, UncheckedExtrinsic>;
    73     /// Opaque block identifier type.
    74     pub type BlockId = sp_runtime::generic::BlockId<Block>;
    75
    76     impl_opaque_keys! {
    77         pub struct SessionKeys {
    78             pub aura: Aura,
    79             pub grandpa: Grandpa,
    80         }
    81     }
    82 }
    83
    84 // To learn more about runtime configuration, see:
    85 // https://docs.substrate.io/main-docs/build/runtime-customization/
    86 #[sp_version::runtime_version]
    87 pub const VERSION: sp_version::RuntimeVersion = sp_version::RuntimeVersion {
    88     spec_name: create_runtime_str!("node-template"),
    89     impl_name: create_runtime_str!("node-template"),
    90     authoring_version: 1,
    91     // The version of the runtime specification. A full node will not attempt to use its native
    92     //   runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
    93     //   `spec_version`, and `authoring_version` are the same between Wasm and native.
    94     // This value is set to the lower hexadecimal value of the last 2 bytes of the Git commit ID.
    95     spec_version: 1,
    96     impl_version: 1,
    97     apis: RUNTIME_API_VERSIONS,
    98     transaction_version: 1,
    99     state_version: 1,

100 };
101
102 /// This determines the average expected block time that we are targeting.
103 /// Blocks will be produced at a minimum duration defined by `SLOT_DURATION`.
104 /// `SLOT_DURATION` is picked up by `pallet_timestamp` which is in turn picked
105 /// up by `pallet_aura` to implement `fn slot_duration()`.
106 ///
107 /// Change this to adjust the block time.
108 pub const MILLISECS_PER_BLOCK: u64 = 6000;
109
110 // NOTE: Currently it is not possible to change the slot duration after the chain has started.
111 // Attempting to do so will brick block production.
112 pub const SLOT_DURATION: u64 = MILLISECS_PER_BLOCK;
113
114 // Time is measured by number of blocks.
115 pub const MINUTES: BlockNumber = 60_000 / (MILLISECS_PER_BLOCK as BlockNumber);
116 pub const HOURS: BlockNumber = MINUTES _ 60;
117 pub const DAYS: BlockNumber = HOURS _ 24;
118
119 /// The version information used to identify this runtime when compiled natively.
120 #[cfg(feature = "std")]
121 pub fn native_version() -> sp_version::NativeVersion {
122 sp_version::NativeVersion {
123 runtime_version: VERSION,
124 can_author_with: Default::default(),
125 }
126 }
127
128 const NORMAL_DISPATCH_RATIO: Perbill = Perbill::from_percent(75);
129
130 /// We assume that ~10% of the block weight is consumed by `on_initialize` handlers.
131 /// This is used to limit the maximal weight of a single extrinsic.
132 const AVERAGE_ON_INITIALIZE_RATIO: Perbill = Perbill::from_percent(10);
133
134 /// We allow for 2 seconds of compute with a 6 second average block time.
135 const MAXIMUM_BLOCK_WEIGHT: Weight = Weight::from_parts(
136 WEIGHT_REF_TIME_PER_SECOND.saturating_mul(2),
137 u64::MAX,
138 );
139
140 /// The BABE epoch configuration at genesis.
141 pub const BABE_GENESIS_EPOCH_CONFIG: sp_consensus_babe::BabeEpochConfiguration =
142 sp_consensus_babe::BabeEpochConfiguration {
143 c: PRIMARY_PROBABILITY,
144 allowed_slots: sp_consensus_babe::AllowedSlots::PrimaryAndSecondaryPlainSlots,
145 };
146
147 // Configure FRAME pallets to include in runtime.
148
149 parameter_types! {
150 pub const BlockHashCount: BlockNumber = 2400;
151 pub const Version: RuntimeVersion = VERSION;
152 /// We allow for 2 seconds of compute with a 6 second average block time.
153 pub BlockWeights: frame_system::limits::BlockWeights = frame_system::limits::BlockWeights
154 ::with_sensible_defaults(MAXIMUM_BLOCK_WEIGHT, NORMAL_DISPATCH_RATIO);
155 pub BlockLength: frame_system::limits::BlockLength = frame_system::limits::BlockLength
156 ::max_with_normal_ratio(5 _ 1024 _ 1024, NORMAL_DISPATCH_RATIO);
157 pub const SS58Prefix: u8 = 42;
158 }
159
160 // Configure FRAME pallets to include in runtime.
161
162 impl frame_system::Config for Runtime {
163 /// The basic call filter to use in dispatchable.
164 type BaseCallFilter = frame_support::traits::Everything;
165 /// Block & extrinsics weights: base values and limits.
166 type BlockWeights = BlockWeights;
167 /// The maximum length of a block (in bytes).
168 type BlockLength = BlockLength;
169 /// The identifier used to distinguish between accounts.
170 type AccountId = AccountId;
171 /// The aggregated dispatch type that is available for extrinsics.
172 type RuntimeCall = RuntimeCall;
173 /// The lookup mechanism to get account ID from whatever is passed in dispatchers.
174 type Lookup = AccountIdLookup<AccountId, ()>;
175 /// The type for hashing blocks and tries.
176 type Hash = Hash;
177 /// The hashing algorithm used.
178 type Hashing = BlakeTwo256;
179 /// The header type.
180 type Header = generic::Header<BlockNumber, BlakeTwo256>;
181 /// The ubiquitous event type.
182 type RuntimeEvent = RuntimeEvent;
183 /// The ubiquitous origin type.
184 type RuntimeOrigin = RuntimeOrigin;
185 /// Maximum number of block number to block hash mappings to keep (oldest pruned first).
186 type BlockHashCount = BlockHashCount;
187 /// The weight of database operations that the runtime can invoke.
188 type DbWeight = RocksDbWeight;
189 /// Version of the runtime.
190 type Version = Version;
191 /// Converts a module to the index of the module in `construct_runtime!`.
192 ///
193 /// This type is being generated by `construct_runtime!`.
194 type PalletInfo = PalletInfo;
195 /// What to do if a new account is created.
196 type OnNewAccount = ();
197 /// What to do if an account is fully reaped from the system.
198 type OnKilledAccount = ();
199 /// The data to be stored in an account.
200 type AccountData = pallet_balances::AccountData<Balance>;
201 /// Weight information for the extrinsics of this pallet.
202 type SystemWeightInfo = ();
203 /// This is used as an identifier of the chain. 42 is the generic substrate prefix.
204 type SS58Prefix = SS58Prefix;
205 /// The set code logic, just the default since we're not a parachain.
206 type OnSetCode = ();
207 type MaxConsumers = frame_support::traits::ConstU32<16>;
208 }
209
210 impl pallet_timestamp::Config for Runtime {
211 /// A timestamp: milliseconds since the unix epoch.
212 type Moment = u64;
213 type OnTimestampSet = Aura;
214 type MinimumPeriod = ConstU64<{ SLOT_DURATION / 2 }>;
215 type WeightInfo = ();
216 }
217
218 impl pallet_authorship::Config for Runtime {
219 type FindAuthor = pallet_session::FindAccountFromAuthorIndex<Self, Aura>;
220 type EventHandler = (Staking, ImOnline);
221 }
222
223 parameter_types! {
224 pub const ExistentialDeposit: Balance = 500;
225 pub const MaxLocks: u32 = 50;
226 pub const MaxReserves: u32 = 50;
227 }
228
229 impl pallet_balances::Config for Runtime {
230 type MaxLocks = MaxLocks;
231 type MaxReserves = MaxReserves;
232 type ReserveIdentifier = [u8; 8];
233 /// The type for recording an account's balance.
234 type Balance = Balance;
235 /// The ubiquitous event type.
236 type RuntimeEvent = RuntimeEvent;
237 type DustRemoval = ();
238 type ExistentialDeposit = ExistentialDeposit;
239 type AccountStore = System;
240 type WeightInfo = pallet_balances::weights::SubstrateWeight<Runtime>;
241 type FreezeIdentifier = ();
242 type MaxFreezes = ();
243 type HoldIdentifier = ();
244 type MaxHolds = ();
245 }
246
247 parameter_types! {
248 pub const TransactionByteFee: Balance = 1;
249 pub OperationalFeeMultiplier: u8 = 5;
250 }
251
252 impl pallet_transaction_payment::Config for Runtime {
253 type RuntimeEvent = RuntimeEvent;
254 type OnChargeTransaction = pallet_transaction_payment::CurrencyAdapter<Balances, ()>;
255 type WeightToFee = IdentityFee<Balance>;
256 type LengthToFee = IdentityFee<Balance>;
257 type FeeMultiplierUpdate = ();
258 type OperationalFeeMultiplier = OperationalFeeMultiplier;
259 }
260
261 // Create the runtime by composing the FRAME pallets that were previously configured.
262 construct_runtime!(
263 pub struct Runtime where
264 Block = Block,
265 NodeBlock = opaque::Block,
266 UncheckedExtrinsic = UncheckedExtrinsic
267 {
268 System: frame_system,
269 Timestamp: pallet_timestamp,
270 Authorship: pallet_authorship,
271 Balances: pallet_balances,
272 TransactionPayment: pallet_transaction_payment,
273
274 // Pallet for our custom logic
275 TemplatePallet: template_pallet,
276 }
277 );
278
279 /// The address format for describing accounts.
280 pub type Address = sp_runtime::MultiAddress<AccountId, ()>;
281 /// Block header type as expected by this runtime.
282 pub type Header = generic::Header<BlockNumber, BlakeTwo256>;
283 /// Block type as expected by this runtime.
284 pub type Block = generic::Block<Header, UncheckedExtrinsic>;
285 /// The SignedExtension to the basic transaction logic.
286 pub type SignedExtra = (
287 frame_system::CheckNonZeroSender<Runtime>,
288 frame_system::CheckSpecVersion<Runtime>,
289 frame_system::CheckTxVersion<Runtime>,
290 frame_system::CheckGenesis<Runtime>,
291 frame_system::CheckEra<Runtime>,
292 frame_system::CheckNonce<Runtime>,
293 frame_system::CheckWeight<Runtime>,
294 pallet_transaction_payment::ChargeTransactionPayment<Runtime>,
295 );
296
297 /// Unchecked extrinsic type as expected by this runtime.
298 pub type UncheckedExtrinsic =
299 generic::UncheckedExtrinsic<Address, RuntimeCall, Signature, SignedExtra>;
300 /// The payload being signed in transactions.
301 pub type SignedPayload = generic::SignedPayload<RuntimeCall, SignedExtra>;
302 /// Executive: handles dispatch to the various modules.
303 pub type Executive = frame_executive::Executive<
304 Runtime,
305 Block,
306 frame_system::ChainContext<Runtime>,
307 Runtime,
308 AllPalletsWithSystem,
309 >;
310
311 #[cfg(feature = "runtime-benchmarks")]
312 mod benchmarking {
313 use frame_benchmarking::v2;
314 use frame_support::traits::TrackedStorageKey;
315 impl pallet_template::Config for Runtime {
316 type RuntimeEvent = RuntimeEvent;
317 }
318
319 #[v2::benchmarks]
320 mod benchmarks {
321 define_benchmarks!(
322 [frame_benchmarking, BaselineBench::<Runtime>]
323 [pallet_template, TemplatePallet]
324 );
325 }
326
327 impl frame_system_benchmarking::Config for Runtime {}
328 }
329
330 impl_runtime_apis! {
331 impl sp_api::Core<Block> for Runtime {
332 fn version(&self) -> RuntimeVersion {
333 VERSION
334 }
335
336 fn execute_block(block: Block) {
337 Executive::execute_block(block);
338 }
339
340 fn initialize_block(header: &<Block as BlockT>::Header) {
341 Executive::initialize_block(header)
342 }
343 }
344
345 impl sp_api::Metadata<Block> for Runtime {
346 fn metadata() -> OpaqueMetadata {
347 OpaqueMetadata::new(Runtime::metadata().into())
348 }
349
350 fn metadata_at_version(version: u32) -> Option<OpaqueMetadata> {
351 Runtime::metadata_at_version(version)
352 }
353
354 fn metadata_versions() -> sp_std::vec::Vec<u32> {
355 Runtime::metadata_versions()
356 }
357 }
358
359 impl sp_block_builder::BlockBuilder<Block> for Runtime {
360 fn apply_extrinsic(extrinsic: <Block as BlockT>::Extrinsic) -> ApplyExtrinsicResult {
361 Executive::apply_extrinsic(extrinsic)
362 }
363
364 fn finalize_block() -> <Block as BlockT>::Header {
365 Executive::finalize_block()
366 }
367
368 fn inherent_extrinsics(data: sp_inherents::InherentData) -> Vec<<Block as BlockT>::Extrinsic> {
369 data.create_extrinsics()
370 }
371
372 fn check_inherents(
373 block: Block,
374 data: sp_inherents::InherentData,
375 ) -> sp_inherents::CheckInherentsResult {
376 data.check_extrinsics(&block)
377 }
378 }
379
380 impl sp_transaction_pool::runtime_api::TaggedTransactionQueue<Block> for Runtime {
381 fn validate_transaction(
382 source: TransactionSource,
383 tx: <Block as BlockT>::Extrinsic,
384 block_hash: <Block as BlockT>::Hash,
385 ) -> TransactionValidity {
386 Executive::validate_transaction(source, tx, block_hash)
387 }
388 }
389
390 impl sp_offchain::OffchainWorkerApi<Block> for Runtime {
391 fn offchain_worker(header: &<Block as BlockT>::Header) {
392 Executive::offchain_worker(header)
393 }
394 }
395
396 impl sp_consensus_aura::AuraApi<Block, sp_core::sr25519::Public> for Runtime {
397 fn slot_duration() -> sp_consensus_aura::SlotDuration {
398 sp_consensus_aura::SlotDuration::from_millis(Aura::slot_duration())
399 }
400
401 fn authorities() -> Vec<sp_consensus_aura::AuthorityId> {
402 Aura::authorities().into_inner()
403 }
404 }
405
406 impl sp_session::SessionKeys<Block> for Runtime {
407 fn generate_session_keys(seed: Option<Vec<u8>>) -> Vec<u8> {
408 opaque::SessionKeys::generate(seed)
409 }
410
411 fn decode_session_keys(
412 encoded: Vec<u8>,
413 ) -> Option<Vec<(Vec<u8>, KeyTypeId)>> {
414 opaque::SessionKeys::decode_into_raw_public_keys(&encoded)
415 }
416 }
417
418 impl frame_system_rpc_runtime_api::AccountNonceApi<Block, AccountId, Index> for Runtime {
419 fn account_nonce(account: AccountId) -> Index {
420 System::account_nonce(account)
421 }
422 }
423
424 impl pallet_transaction_payment_rpc_runtime_api::TransactionPaymentApi<Block, Balance> for Runtime
{
425 fn query_info(
426 uxt: <Block as BlockT>::Extrinsic,
427 len: u32,
428 ) -> pallet_transaction_payment_rpc_runtime_api::RuntimeDispatchInfo<Balance> {
429 TransactionPayment::query_info(uxt, len)
430 }
431 fn query_fee_details(
432 uxt: <Block as BlockT>::Extrinsic,
433 len: u32,
434 ) -> pallet_transaction_payment::FeeDetails<Balance> {
435 TransactionPayment::query_fee_details(uxt, len)
436 }
437 fn query_weight_to_fee(weight: Weight) -> Balance {
438 TransactionPayment::weight_to_fee(weight)
439 }
440 fn query_length_to_fee(length: u32) -> Balance {
441 TransactionPayment::length_to_fee(length)
442 }
443 }
444
445 impl pallet_transaction_payment_rpc_runtime_api::TransactionPaymentCallApi<Block, Balance,
RuntimeCall>
446 for Runtime
447 {
448 fn query_call_info(
449 call: RuntimeCall,
450 len: u32,
451 ) -> pallet_transaction_payment::RuntimeDispatchInfo<Balance> {
452 TransactionPayment::query_call_info(call, len)
453 }
454 fn query_call_fee_details(
455 call: RuntimeCall,
456 len: u32,
457 ) -> pallet_transaction_payment::FeeDetails<Balance> {
458 TransactionPayment::query_call_fee_details(call, len)
459 }
460 }
461
462 #[cfg(feature = "runtime-benchmarks")]
463 impl frame_benchmarking::Benchmark<Block> for Runtime {
464 fn benchmark_metadata(extra: bool) -> (
465 Vec<frame_benchmarking::BenchmarkList>,
466 Vec<frame_support::traits::StorageInfo>,
467 ) {
468 use frame_benchmarking::{baseline, Benchmarking, BenchmarkList};
469 use frame_support::traits::StorageInfoTrait;
470 use frame_system_benchmarking::Pallet as SystemBench;
471 use baseline::Pallet as BaselineBench;
472
473 let mut list = Vec::<BenchmarkList>::new();
474 list_benchmark!(list, extra, frame_benchmarking, BaselineBench::<Runtime>);
475 list_benchmark!(list, extra, pallet_template, TemplatePallet);
476
477 let storage_info = AllPalletsWithSystem::storage_info();
478
479 (list, storage_info)
480 }
481
482 fn dispatch_benchmark(
483 config: frame_benchmarking::BenchmarkConfig
484 ) -> Result<Vec<frame_benchmarking::BenchmarkBatch>, sp_runtime::RuntimeString> {
485 use frame_benchmarking::{baseline, Benchmarking, BenchmarkBatch, TrackedStorageKey};
486
487 use frame_system_benchmarking::Pallet as SystemBench;
488 use baseline::Pallet as BaselineBench;
489
490 impl frame_system_benchmarking::Config for Runtime {}
491 impl baseline::Config for Runtime {}
492
493 use frame_support::traits::WhitelistedStorageKeys;
494 let whitelist: Vec<TrackedStorageKey> = AllPalletsWithSystem::whitelisted_storage_keys();
495
496 let mut batches = Vec::<BenchmarkBatch>::new();
497 let params = (&config, &whitelist);
498
499 add_benchmark!(params, batches, frame_benchmarking, BaselineBench::<Runtime>);
500 add_benchmark!(params, batches, pallet_template, TemplatePallet);
501
502 Ok(batches)
503 }
504 }
505
506 #[cfg(feature = "try-runtime")]
507 impl frame_try_runtime::TryRuntime<Block> for Runtime {
508 fn on_runtime_upgrade(checks: frame_try_runtime::UpgradeCheckSelect) -> (Weight, Weight) {
509 // NOTE: intentional unwrap: we don't want to propagate the error backwards, and want to
510 // have a backtrace here.
511 let weight = Executive::try_runtime_upgrade(checks).unwrap();
512 (weight, BlockWeights::get().max_block)
513 }
514
515 fn execute_block(
516 block: Block,
517 state_root_check: bool,
518 signature_check: bool,
519 select: frame_try_runtime::TryStateSelect,
520 ) -> Weight {
521 // NOTE: intentional unwrap: we don't want to propagate the error backwards, and want to
522 // have a backtrace here.
523 Executive::try_execute_block(block, state_root_check, signature_check, select).unwrap()
524 }
525 }
526 }

Step 3: Build and run your parachain

1 # Build the parachain
2 cargo build --release
3
4 # Run in development mode
5 ./target/release/node-template --dev
6
7 # Generate a raw chain specification
8 ./target/release/node-template build-spec --chain=dev --raw > customSpec.json

---

SMART CONTRACT DEVELOPMENT

ink! Development Setup

1 # Install cargo-contract
2 cargo install cargo-contract --force --locked
3
4 # Create a new ink! project
5 cargo contract new my-contract
6
7 # Install Wasm target
8 rustup target add wasm32-unknown-unknown

ink! Project Structure

    1 my-contract/
    2 ├── Cargo.toml          # Dependencies and configuration
    3 ├── lib.rs             # Contract code
    4 ├── metadata.json      # ABI metadata
    5 ├── target/            # Build artifacts
    6 │   └── ink/           # Wasm contract
    7 │       ├── my-contract.wasm
    8 │       └── metadata.json
    9 └── tests/             # Integration tests

10 └── e2e.rs

ink! Best Practices

1. Storage Management:

1 #[ink(storage)]
2 pub struct MyContract {
3 // Use Mapping for large datasets
4 balances: Mapping<AccountId, Balance>,
5 // Use Vec for ordered collections
6 users: Vec<AccountId>,
7 // Use simple types for single values
8 total_supply: Balance,
9 }

2. Gas Optimization:


    1 impl MyContract {
    2     // Cache expensive calculations
    3     #[ink(message)]
    4     pub fn expensive_calculation(&self) -> u32 {
    5         // Cache in storage or calculate once and store
    6         let cached = self.get_cached_result();
    7         if cached.is_none() {
    8             let result = self.perform_calculation();
    9             self.set_cached_result(result);

10 result
11 } else {
12 cached.unwrap()
13 }
14 }
15 }

3. Error Handling:


    1 #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    2 #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    3 pub enum Error {
    4     InsufficientFunds,
    5     Unauthorized,
    6     AlreadyInitialized,
    7 }
    8
    9 #[ink(message)]

10 pub fn transfer(&mut self, to: AccountId, amount: Balance) -> Result<(), Error> {
11 let balance = self.balances.get(self.env().caller()).unwrap_or(0);
12 if balance < amount {
13 return Err(Error::InsufficientFunds);
14 }
15
16 self.balances.insert(self.env().caller(), &(balance - amount));
17 let to_balance = self.balances.get(&to).unwrap_or(0);
18 self.balances.insert(&to, &(to_balance + amount));
19
20 Ok(())
21 }

ink! Testing

    1 // tests/flipper.rs
    2 use my_contract::{MyContract, MyContractRef};
    3 use ink::env;
    4
    5 #[ink::test]
    6 fn default_works() {
    7     let contract = MyContract::new(false);
    8     assert_eq!(contract.get(), false);
    9 }

10
11 #[ink::test]
12 fn it_works() {
13 let mut contract = MyContract::new(false);
14 assert_eq!(contract.get(), false);
15 contract.flip();
16 assert_eq!(contract.get(), true);
17 }
18
19 #[ink::test]
20 fn transfer_works() {
21 let accounts = env::test::default_accounts::<env::DefaultEnvironment>();
22 // Set the contract as caller
23 env::test::set_caller::<env::DefaultEnvironment>(accounts.alice);
24  
 25 let mut contract = MyContract::new();
26 assert_eq!(contract.transfer(accounts.bob, 10), Ok(()));
27 assert_eq!(contract.balance_of(accounts.bob), 10);
28 }

---

DEPLOYMENT & TESTING

Local Development Setup

Running a Local Node:

1 # Run the node in development mode
2 ./target/release/node-template --dev
3
4 # With custom chain specification
5 ./target/release/node-template --chain=local

Testing with Polkadot.js:

1.  Go to Polkadot.js Apps (https://polkadot.js.org/apps/)
2.  Connect to your local node (ws://127.0.0.1:9944)
3.  Use the "Developer" → "Extrinsics" tab to interact with your chain

Deploying Ink! Contracts

1. Install contract tools:

1 cargo install cargo-contract --force --locked

2. Build and deploy:

1 # Build the contract
2 cargo contract build
3
4 # Deploy using Polkadot.js Apps UI
5 # Or programmatically

3. Deploy with code:


    1 // Deploy contract
    2 const code = new CodePromise(api, wasm, metadata);
    3
    4 // Create deployment
    5 const gasLimit = 100000n * 1000000n; // 100000 units at 1000000 weight
    6 const storageDepositLimit = null;
    7
    8 const contract = new ContractPromise(api, metadata, code);
    9 const tx = contract.tx.new({ gasLimit, storageDepositLimit }, 42);

10
11 // Sign and send
12 tx.signAndSend(alice, (result) => {
13 if (result.status.isInBlock) {
14 console.log(`Contract deployed at block ${result.status.asInBlock.toHex()}`);
15 }
16 });

Testing Strategies

Unit Tests in Rust:

1 #[cfg(test)]
2 mod tests {
3 use super::\*;
4
5 #[test]
6 fn it_works() {
7 assert_eq!(2 + 2, 4);
8 }
9 }

Integration Tests:

    1 #[cfg(feature = "std")]
    2 #[cfg(test)]
    3 mod integration_tests {
    4     use super::*;
    5     use ink_env::clear_contract;
    6
    7     #[ink::test]
    8     fn transfer_works() {
    9         let accounts = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>();

10 let mut contract = MyContract::new();
11
12 // Transfer
13 contract.transfer(accounts.bob, 10);
14 assert_eq!(contract.balance_of(accounts.bob), 10);
15 }
16 }

---

CROSS-CHAIN MESSAGING (XCM)

What is XCM?

Cross-Consensus Message Format (XCM) is a message format that enables communication between different consensus
systems within the Polkadot ecosystem.

XCM Architecture

1 Source Chain
2 ↓
3 XCM Message (Versioned)
4 ↓
5 Transact (Execute on destination)
6 ↓
7 Destination Chain

XCM Example

    1 use xcm::{VersionedXcm, v3::Xcm};
    2 use xcm_executor::traits::WeightBounds;
    3
    4 // Simple XCM message to transfer tokens
    5 let xcm = Xcm(vec![
    6     Instruction::WithdrawAsset((MultiLocation::here(), amount).into()),
    7     Instruction::BuyExecution {
    8         fees: (MultiLocation::here(), amount).into(),
    9         weight_limit: WeightLimit::Limited(Weight::from_parts(1000, 1000)),

10 },
11 Instruction::DepositAsset {
12 assets: Wild(AllCounted(1)),
13 beneficiary: MultiLocation { parents: 0, interior: X1(AccountId32 { network: None, id:
recipient.into() }) },
14 },
15 ]);

XCM Use Cases

1.  Token Transfers: Moving assets between chains
2.  Cross-chain Execution: Executing calls on other chains
3.  Staking: Cross-chain staking operations
4.  DeFi: Cross-chain lending, swapping, etc.

---

SECURITY BEST PRACTICES

Substrate Security

1. Storage Security:

- Use ensure_signed for authenticated calls
- Implement proper access controls
- Validate all inputs
- Use ensure! macros for safety checks

2. Runtime Security:

- Audit all pallet interactions
- Implement proper weight calculation
- Use bounded collections
- Validate cross-chain messages

3. Pallet Security:

- Use #[pallet::weight(...)] for all dispatchable functions
- Implement proper origin checks
- Use bounded types for storage
- Validate complex inputs

ink! Security

1. Reentrancy:


    1 // DON'T DO THIS
    2 #[ink(message)]
    3 pub fn withdraw(&mut self, amount: Balance) {
    4     self.balances.insert(self.env().caller(), &(self.balance - amount));
    5     // External call before state update - vulnerable to reentrancy
    6     self.env().transfer(self.env().caller(), amount);
    7 }
    8
    9 // DO THIS INSTEAD

10 #[ink(message)]
11 pub fn withdraw(&mut self, amount: Balance) {
12 self.balances.insert(self.env().caller(), &(self.balance - amount));
13 // State update BEFORE external call
14 self.env().transfer(self.env().caller(), amount);
15 }

2. Integer Overflow:

1 // Use checked arithmetic
2 #[ink(message)]
3 pub fn safe_add(&self, a: u32, b: u32) -> Option<u32> {
4 a.checked_add(b)
5 }

3. Access Control:

1 #[ink(message)]
2 pub fn privileged_function(&mut self) -> Result<(), Error> {
3 ensure!(self.owner == self.env().caller(), Error::Unauthorized);
4 // Function logic here
5 Ok(())
6 }

Common Vulnerabilities to Avoid

1.  Reentrancy Attacks: Update state before making external calls
2.  Integer Overflow: Use checked arithmetic operations
3.  Access Control: Always verify caller permissions
4.  Gas Limit: Consider gas costs for complex operations
5.  Storage Costs: Be mindful of state growth

---

RESOURCES & REFERENCES

Documentation

1.  Official Polkadot Documentation: https://wiki.polkadot.network/
2.  Substrate Developer Hub: https://docs.substrate.io/
3.  ink! Documentation: https://use.ink/
4.  Polkadot SDK Documentation: https://paritytech.github.io/polkadot-sdk/

Tools & Libraries

1.  Polkadot.js Apps: https://polkadot.js.org/apps/
2.  Substrate Node Template: https://github.com/paritytech/polkadot-sdk/tree/master/substrate/bin/node-template
3.  ink! Examples: https://github.com/paritytech/ink-examples
4.  Substrate Playground: https://docs.substrate.io/playground/

Communities

1.  Polkadot Forum: https://forum.polkadot.network/
2.  Substrate Technical Community: https://matrix.to/#/#substrate-technical:matrix.org
3.  ink! Discord: https://discord.gg/8RWpJaV5
4.  Polkadot StackExchange: https://substrate.stackexchange.com/

Development Networks

1.  Polkadot (Mainnet): wss://rpc.polkadot.io
2.  Kusama (Canary): wss://kusama-rpc.polkadot.io
3.  Rococo (Testnet): wss://rococo-rpc.polkadot.io
4.  Westend (Testnet): wss://westend-rpc.polkadot.io

---

QUICK START TEMPLATES

1. Basic Substrate Pallet Template


    1 #![cfg_attr(not(feature = "std"), no_std)]
    2
    3 pub use pallet::*;
    4
    5 #[frame_support::pallet]
    6 pub mod pallet {
    7     use frame_support::{pallet_prelude::*};
    8     use frame_system::pallet_prelude::*;
    9

10 #[pallet::pallet]
11 pub struct Pallet<T>(_);
12
13 #[pallet::config]
14 pub trait Config: frame_system::Config {
15 type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
16 }
17
18 #[pallet::storage]
19 #[pallet::getter(fn something)]
20 pub type Something<T> = StorageValue<_, u32>;
21
22 #[pallet::event]
23 #[pallet::generate_deposit(pub(super) fn deposit_event)]
24 pub enum Event<T: Config> {
25 SomethingStored(u32, T::AccountId),
26 }
27
28 #[pallet::error]
29 pub enum Error<T> {
30 NoneValue,
31 StorageOverflow,
32 }
33
34 #[pallet::call]
35 impl<T: Config> Pallet<T> {
36 #[pallet::call_index(0)]
37 #[pallet::weight(10_000 + T::DbWeight::get().writes(1))]
38 pub fn do_something(origin: OriginFor<T>, something: u32) -> DispatchResult {
39 let who = ensure_signed(origin)?;
40  
 41 Something::<T>::put(something);
42 Self::deposit_event(Event::SomethingStored(something, who));
43 Ok(())
44 }
45 }
46 }

2. Basic ink! Smart Contract Template


    1 #![cfg_attr(not(feature = "std"), no_std, no_main)]
    2
    3 #[ink::contract]
    4 mod basic_contract {
    5     #[ink(storage)]
    6     pub struct BasicContract {
    7         value: u32,
    8         owner: AccountId,
    9     }

10
11 impl BasicContract {
12 #[ink(constructor)]
13 pub fn new(initial_value: u32) -> Self {
14 Self {
15 value: initial_value,
16 owner: Self::env().caller(),
17 }
18 }
19
20 #[ink(message)]
21 pub fn get_value(&self) -> u32 {
22 self.value
23 }
24
25 #[ink(message)]
26 pub fn set_value(&mut self, new_value: u32) {
27 self.value = new_value;
28 }
29 }
30 }

3. Frontend Integration Template


    1 import { ApiPromise, WsProvider } from '@polkadot/api';
    2 import { Keyring } from '@polkadot/keyring';
    3
    4 // Connect to Polkadot network
    5 const provider = new WsProvider('wss://rpc.polkadot.io');
    6 const api = await ApiPromise.create({ provider });
    7
    8 // Create keyring
    9 const keyring = new Keyring({ type: 'sr25519' });

10 const alice = keyring.addFromUri('//Alice');
11
12 // Query chain state
13 const chain = await api.rpc.system.chain();
14 const lastHeader = await api.rpc.chain.getHeader();
15
16 // Submit transaction
17 const unsub = await api.tx.balances
18 .transfer('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', 12345)
19 .signAndSend(alice, ({ events, status }) => {
20 console.log(`Status: ${status.type}`);
21  
 22 if (status.isFinalized) {
23 console.log(`Transaction included at blockHash ${status.asFinalized}`);
24 unsub();
25 }
26 });

---

This comprehensive guide provides you with all the essential knowledge needed to start building on Polkadot, from
basic concepts to advanced development patterns. Whether you're looking to build parachains, smart contracts, or
cross-chain applications, this resource will guide you through the entire development lifecycle.

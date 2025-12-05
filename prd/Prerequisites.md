# Prerequisites for Developing Soroban and Ink! Smart Contracts

## System Requirements

### Operating System
- **Linux** (Ubuntu 20.04+ recommended)
- **macOS** (10.15+ recommended)
- **Windows** (via WSL2 with Ubuntu)

### Hardware Requirements
- **CPU**: Modern processor (x86-64) with 2+ cores
- **RAM**: 4GB+ (8GB+ recommended)
- **Storage**: 10GB+ free disk space
- **Internet**: Stable connection for downloads and testing

### Software Dependencies
- **Git**: Version control system (2.25+)
- **Rust**: Programming language and toolchain
- **Cargo**: Rust's package manager and build system
- **Basic CLI tools**: curl, wget, make, gcc

## Development Environment Setup

### Installing Git
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install git

# macOS (with Homebrew)
brew install git

# Verify installation
git --version
```

### Installing Rust and Cargo
```bash
# Install Rust using rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Restart shell or source environment
source ~/.cargo/env

# Verify installation
rustc --version
cargo --version
```

### Setting Up Rust for Smart Contracts
```bash
# Add WebAssembly target (required for both Soroban and Ink!)
rustup target add wasm32-unknown-unknown

# Update to latest stable
rustup update stable
rustup default stable
```

## Soroban (Stellar) Prerequisites

### Installing Soroban CLI
```bash
# Install the Soroban CLI
cargo install --locked soroban-cli

# Or install the newer stellar-cli
cargo install --locked stellar-cli

# Verify installation
soroban --version
# or
stellar --version
```

### Installing Additional Tools (Optional but Recommended)
```bash
# Install the Soroban SDK for Rust
cargo install --locked soroban-sdk

# Install Soroban test utilities
cargo install --locked soroban-spec-tools
```

### Setting Up Testnet Access
```bash
# Add Soroban testnet to your environment
stellar network add --global testnet --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015"
```

## Ink! (Polkadot) Prerequisites

### Installing cargo-contract
```bash
# Install the primary tool for Ink! development
cargo install cargo-contract --force

# Verify installation
cargo contract --version
```

### Installing Additional Tools
```bash
# Install substrate-contract-node for local testing (optional)
# Download from: https://github.com/paritytech/substrate-contracts-node

# Install Substrate build tools (for advanced development)
sudo apt install build-essential protobuf-compiler
```

## IDE and Development Tools

### Recommended Editors
- **Visual Studio Code** with extensions:
  - `rust-analyzer` for Rust support
  - `Even Better TOML` for Cargo.toml editing
  - `Rainbow CSV` for data files

### VS Code Extensions Setup
```bash
# If using VS Code, install these extensions:
code --install-extension rust-lang.rust-analyzer
code --install-extension tamasfe.even-better-toml
code --install-extension mechatroner.rainbow-csv
```

### Additional Development Tools
```bash
# Install tree for directory visualization
sudo apt install tree  # Ubuntu/Debian
brew install tree      # macOS

# Install httpie for API testing
sudo apt install httpie  # Ubuntu/Debian
brew install httpie      # macOS
```

## Network and Account Setup

### Stellar Testnet Setup
1. **Create a testnet account**:
   - Visit: https://laboratory.stellar.org/#account-creator
   - Get testnet XLM for contract deployment fees

2. **Install wallet extensions**:
   - **Freighter**: Stellar wallet extension for browser
   - Available on Chrome Web Store and Firefox Add-ons

### Polkadot Testnet Setup
1. **Install Polkadot.js extension**:
   - Available for Chrome, Firefox, and other browsers
   - Required for interacting with Polkadot contracts

2. **Get testnet tokens**:
   - Rococo testnet faucet for testing contracts
   - Available through Polkadot.js extension

## Verification Steps

### Verify Rust Installation
```bash
# Check Rust version
rustc --version

# Check Cargo version
cargo --version

# Verify WASM target
rustup target list --installed | grep wasm32-unknown-unknown
```

### Verify Soroban Installation
```bash
# Check Soroban version
soroban --version

# Or if using stellar-cli
stellar --version

# Verify network setup
stellar network list
```

### Verify Ink! Installation
```bash
# Check cargo-contract version
cargo contract --version

# Verify WASM target
rustup target list --installed | grep wasm32-unknown-unknown
```

### Test Environment Setup
```bash
# Create a test Rust project
cargo new --bin test_project
cd test_project

# Build the project
cargo build

# If successful, you can remove the test project
cd ..
rm -rf test_project
```

## Troubleshooting Common Issues

### Rust Installation Issues
```bash
# If rustup installation fails
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Update PATH if needed
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### WASM Target Issues
```bash
# Reinstall WASM target if missing
rustup target add wasm32-unknown-unknown --force
```

### Permission Issues
```bash
# If cargo install fails due to permissions
cargo install --locked --root ~/.cargo soroban-cli
# or
cargo install --locked --root ~/.cargo stellar-cli
cargo install --locked --root ~/.cargo cargo-contract
```

### Memory Issues
```bash
# If compilation fails due to memory
export RUSTFLAGS="-C linker=lld -C link-arg=-fuse-ld=lld"
# or increase swap space on Linux
```

## Recommended Learning Resources

### Rust Prerequisites
- **Rust Book**: https://doc.rust-lang.org/book/
- **Rustlings**: Interactive Rust exercises
- **Rust by Example**: https://doc.rust-lang.org/rust-by-example/

### Soroban Resources
- **Soroban Documentation**: https://soroban.stellar.org/
- **Soroban Examples**: GitHub repositories
- **Stellar Developer Community**: Discord and forums

### Ink!/Polkadot Resources
- **Ink! Documentation**: https://use.ink/
- **Substrate Documentation**: https://docs.substrate.io/
- **Polkadot Developer Portal**: https://wiki.polkadot.network/

## Quick Start Verification Script

Create a script to verify your setup:

```bash
#!/bin/bash

echo "Verifying development environment setup..."

echo "Checking Rust..."
if ! command -v rustc &> /dev/null; then
    echo "ERROR: rustc not found. Please install Rust."
    exit 1
fi
echo "✓ rustc version: $(rustc --version)"

echo "Checking Cargo..."
if ! command -v cargo &> /dev/null; then
    echo "ERROR: cargo not found. Please install Rust."
    exit 1
fi
echo "✓ cargo version: $(cargo --version)"

echo "Checking WASM target..."
if ! rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
    echo "ERROR: WASM target not installed. Run: rustup target add wasm32-unknown-unknown"
    exit 1
fi
echo "✓ WASM target installed"

echo "Checking Soroban/Ink! tools..."
if command -v soroban &> /dev/null; then
    echo "✓ Soroban CLI: $(soroban --version)"
elif command -v stellar &> /dev/null; then
    echo "✓ Stellar CLI: $(stellar --version)"
else
    echo "⚠ Soroban CLI not found, installing..."
    cargo install --locked stellar-cli
fi

if command -v cargo-contract &> /dev/null; then
    echo "✓ cargo-contract: $(cargo contract --version)"
else
    echo "⚠ cargo-contract not found, installing..."
    cargo install cargo-contract --force
fi

echo "Environment verification complete! You're ready to develop smart contracts."
```

Save this as `verify_setup.sh` and run it to ensure all prerequisites are met.

## Next Steps

After completing all prerequisites:

1. **Start with the basics**: Create simple "Hello World" contracts for both platforms
2. **Practice testing**: Write comprehensive tests for all contract functions
3. **Learn the ecosystems**: Understand Stellar and Polkadot specific features
4. **Build gradually**: Start with simple contracts and increase complexity

With these prerequisites installed and verified, you'll be ready to develop both Soroban and Ink! smart contracts for cross-chain applications like ChainRepute.
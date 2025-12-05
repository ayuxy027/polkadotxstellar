import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { getWallets, type Wallet, type WalletAccount } from "@talismn/connect-wallets";

// ============================================
// Types & Interfaces
// ============================================

export interface EVMWallet {
  address: string | null;
  connected: boolean;
  chainId: number | null;
  walletName: string | null;
}

export interface PolkadotWallet {
  address: string | null;
  connected: boolean;
  name: string | null;
  account: WalletAccount | null;
  accounts: WalletAccount[];
  wallet: Wallet | null;
}

interface EVMWalletOption {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
  deepLink?: string;
}

interface WalletContextType {
  // EVM wallet state (Trust Wallet / MetaMask / etc via injected provider)
  evm: EVMWallet;
  // Polkadot wallet state (via Talisman)
  polkadot: PolkadotWallet;
  // Loading states
  isConnectingEVM: boolean;
  isConnectingPolkadot: boolean;
  // Error states
  evmError: string | null;
  polkadotError: string | null;
  // Available Polkadot wallets
  availableWallets: Wallet[];
  // Available EVM wallets
  availableEVMWallets: EVMWalletOption[];
  // Connection functions
  connectEVM: (walletType?: string) => Promise<void>;
  connectPolkadot: (walletName?: string) => Promise<void>;
  disconnectEVM: () => void;
  disconnectPolkadot: () => void;
  disconnectAll: () => void;
  // Polkadot account selection
  selectPolkadotAccount: (account: WalletAccount) => void;
  // Helper to check if both wallets are connected
  areBothConnected: () => boolean;
  // Demo mode
  isDemoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  // Wallet selection modal
  showEVMModal: boolean;
  setShowEVMModal: (show: boolean) => void;
}

const defaultEVMWallet: EVMWallet = {
  address: null,
  connected: false,
  chainId: null,
  walletName: null,
};

const defaultPolkadotWallet: PolkadotWallet = {
  address: null,
  connected: false,
  name: null,
  account: null,
  accounts: [],
  wallet: null,
};

// Demo mode test addresses
const DEMO_EVM_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f3bE21";
const DEMO_POLKADOT_ADDRESS = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

export const WalletContext = createContext<WalletContextType>({
  evm: defaultEVMWallet,
  polkadot: defaultPolkadotWallet,
  isConnectingEVM: false,
  isConnectingPolkadot: false,
  evmError: null,
  polkadotError: null,
  availableWallets: [],
  availableEVMWallets: [],
  connectEVM: async () => { },
  connectPolkadot: async () => { },
  disconnectEVM: () => { },
  disconnectPolkadot: () => { },
  disconnectAll: () => { },
  selectPolkadotAccount: () => { },
  areBothConnected: () => false,
  isDemoMode: false,
  enableDemoMode: () => { },
  disableDemoMode: () => { },
  showEVMModal: false,
  setShowEVMModal: () => { },
});

// ============================================
// Constants
// ============================================

const APP_NAME = "ChainRepute";
const STORAGE_KEYS = {
  POLKADOT_WALLET: "chainrepute_polkadot_wallet",
  POLKADOT_ADDRESS: "chainrepute_polkadot_address",
  EVM_WALLET: "chainrepute_evm_wallet",
  EVM_ADDRESS: "chainrepute_evm_address",
};

// EVM Wallet detection helpers
const getEVMProvider = (): any => {
  if (typeof window === "undefined") return null;

  const ethereum = (window as any).ethereum;
  if (!ethereum) return null;

  return ethereum;
};

const detectEVMWallets = (): EVMWalletOption[] => {
  const wallets: EVMWalletOption[] = [];

  if (typeof window === "undefined") return wallets;

  const ethereum = (window as any).ethereum;

  // Check for Trust Wallet
  const isTrust = ethereum?.isTrust || ethereum?.isTrustWallet;
  wallets.push({
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    installed: !!isTrust,
    deepLink: "https://link.trustwallet.com/open_url?coin_id=60&url=" + encodeURIComponent(typeof window !== "undefined" ? window.location.href : ""),
  });

  // Check for MetaMask
  const isMetaMask = ethereum?.isMetaMask && !ethereum?.isTrust;
  wallets.push({
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    installed: !!isMetaMask,
    deepLink: "https://metamask.app.link/dapp/" + (typeof window !== "undefined" ? window.location.host : ""),
  });

  // Check for Coinbase Wallet
  const isCoinbase = ethereum?.isCoinbaseWallet;
  wallets.push({
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    installed: !!isCoinbase,
    deepLink: "https://go.cb-w.com/dapp?cb_url=" + encodeURIComponent(typeof window !== "undefined" ? window.location.href : ""),
  });

  // Generic injected wallet (if any)
  if (ethereum && !isTrust && !isMetaMask && !isCoinbase) {
    wallets.push({
      id: "injected",
      name: "Browser Wallet",
      icon: "💳",
      installed: true,
    });
  }

  return wallets;
};

// ============================================
// Wallet Provider Component
// ============================================

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // Demo mode state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoEvm, setDemoEvm] = useState<EVMWallet>(defaultEVMWallet);
  const [demoPolkadot, setDemoPolkadot] = useState<PolkadotWallet>(defaultPolkadotWallet);

  // EVM state
  const [evmWallet, setEvmWallet] = useState<EVMWallet>(defaultEVMWallet);
  const [isConnectingEVM, setIsConnectingEVM] = useState(false);
  const [evmError, setEvmError] = useState<string | null>(null);
  const [availableEVMWallets, setAvailableEVMWallets] = useState<EVMWalletOption[]>([]);
  const [showEVMModal, setShowEVMModal] = useState(false);

  // Polkadot state
  const [polkadot, setPolkadot] = useState<PolkadotWallet>(defaultPolkadotWallet);
  const [isConnectingPolkadot, setIsConnectingPolkadot] = useState(false);
  const [polkadotError, setPolkadotError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);

  // Derive actual states (demo or real)
  const evm: EVMWallet = isDemoMode ? demoEvm : evmWallet;
  const actualPolkadot = isDemoMode ? demoPolkadot : polkadot;

  // ============================================
  // Initialize available wallets on mount
  // ============================================

  useEffect(() => {
    // Detect EVM wallets
    const evmWallets = detectEVMWallets();
    setAvailableEVMWallets(evmWallets);
    console.log("[WalletContext] Available EVM wallets:", evmWallets);

    // Detect Polkadot wallets
    const wallets = getWallets();
    const installed = wallets.filter((w) => w.installed);
    setAvailableWallets(installed);
    console.log("[WalletContext] Available Polkadot wallets:", installed.map((w) => w.title));
  }, []);

  // ============================================
  // Listen for account/chain changes
  // ============================================

  useEffect(() => {
    const ethereum = getEVMProvider();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setEvmWallet(defaultEVMWallet);
        localStorage.removeItem(STORAGE_KEYS.EVM_WALLET);
        localStorage.removeItem(STORAGE_KEYS.EVM_ADDRESS);
      } else {
        setEvmWallet((prev) => ({
          ...prev,
          address: accounts[0],
          connected: true,
        }));
        localStorage.setItem(STORAGE_KEYS.EVM_ADDRESS, accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      setEvmWallet((prev) => ({
        ...prev,
        chainId: parseInt(chainId, 16),
      }));
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // ============================================
  // Auto-reconnect on mount
  // ============================================

  useEffect(() => {
    // Auto-reconnect EVM
    const autoReconnectEVM = async () => {
      const savedWallet = localStorage.getItem(STORAGE_KEYS.EVM_WALLET);
      const savedAddress = localStorage.getItem(STORAGE_KEYS.EVM_ADDRESS);

      if (savedWallet && savedAddress) {
        const ethereum = getEVMProvider();
        if (ethereum) {
          try {
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0 && accounts.includes(savedAddress)) {
              const chainId = await ethereum.request({ method: "eth_chainId" });
              setEvmWallet({
                address: savedAddress,
                connected: true,
                chainId: parseInt(chainId, 16),
                walletName: savedWallet,
              });
              console.log("[EVM] Auto-reconnected:", savedAddress);
            }
          } catch (err) {
            console.warn("[EVM] Auto-reconnect failed:", err);
          }
        }
      }
    };

    // Auto-reconnect Polkadot
    const autoReconnectPolkadot = async () => {
      const savedWalletName = localStorage.getItem(STORAGE_KEYS.POLKADOT_WALLET);
      const savedAddress = localStorage.getItem(STORAGE_KEYS.POLKADOT_ADDRESS);

      if (savedWalletName && savedAddress) {
        try {
          const wallets = getWallets();
          const wallet = wallets.find(
            (w) => w.extensionName === savedWalletName && w.installed
          );
          if (wallet) {
            await wallet.enable(APP_NAME);
            wallet.subscribeAccounts((accounts) => {
              const savedAccount = accounts?.find((a) => a.address === savedAddress);
              if (savedAccount) {
                setPolkadot({
                  address: savedAccount.address,
                  connected: true,
                  name: savedAccount.name || wallet.title,
                  account: savedAccount,
                  accounts: accounts || [],
                  wallet,
                });
                console.log("[Polkadot] Auto-reconnected:", savedAccount.address);
              }
            });
          }
        } catch (err) {
          console.warn("[Polkadot] Auto-reconnect failed:", err);
          localStorage.removeItem(STORAGE_KEYS.POLKADOT_WALLET);
          localStorage.removeItem(STORAGE_KEYS.POLKADOT_ADDRESS);
        }
      }
    };

    autoReconnectEVM();
    autoReconnectPolkadot();
  }, []);

  // ============================================
  // EVM Connection
  // ============================================

  const connectEVM = useCallback(async (walletType?: string) => {
    console.log("[EVM] Connecting...", walletType || "default");
    setIsConnectingEVM(true);
    setEvmError(null);

    try {
      const ethereum = getEVMProvider();

      if (!ethereum) {
        // No wallet installed - show deep links
        const wallet = availableEVMWallets.find(w => w.id === walletType);
        if (wallet?.deepLink) {
          window.open(wallet.deepLink, "_blank");
          throw new Error("Please install " + wallet.name + " or open this page in the wallet's browser.");
        }
        throw new Error("No EVM wallet detected. Please install Trust Wallet, MetaMask, or another EVM wallet.");
      }

      // Request accounts
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your wallet.");
      }

      // Get chain ID
      const chainId = await ethereum.request({ method: "eth_chainId" });

      // Detect which wallet we're using
      let walletName = "Browser Wallet";
      if (ethereum.isTrust || ethereum.isTrustWallet) walletName = "Trust Wallet";
      else if (ethereum.isMetaMask) walletName = "MetaMask";
      else if (ethereum.isCoinbaseWallet) walletName = "Coinbase Wallet";

      setEvmWallet({
        address: accounts[0],
        connected: true,
        chainId: parseInt(chainId, 16),
        walletName,
      });

      // Save for auto-reconnect
      localStorage.setItem(STORAGE_KEYS.EVM_WALLET, walletName);
      localStorage.setItem(STORAGE_KEYS.EVM_ADDRESS, accounts[0]);

      console.log("[EVM] Connected:", accounts[0], "via", walletName);
      setShowEVMModal(false);

    } catch (err: any) {
      const message = err.message || "Failed to connect EVM wallet";
      console.error("[EVM] Connection error:", message);
      setEvmError(message);
    } finally {
      setIsConnectingEVM(false);
    }
  }, [availableEVMWallets]);

  const disconnectEVM = useCallback(() => {
    setEvmWallet(defaultEVMWallet);
    setEvmError(null);
    localStorage.removeItem(STORAGE_KEYS.EVM_WALLET);
    localStorage.removeItem(STORAGE_KEYS.EVM_ADDRESS);
    console.log("[EVM] Disconnected");
  }, []);

  // ============================================
  // Polkadot Connection
  // ============================================

  const connectPolkadot = useCallback(async (walletName?: string) => {
    console.log("[Polkadot] Starting connection...", walletName || "auto");
    setIsConnectingPolkadot(true);
    setPolkadotError(null);

    try {
      const wallets = getWallets();
      const installedWallets = wallets.filter((w) => w.installed);

      if (installedWallets.length === 0) {
        throw new Error(
          "No Polkadot wallet found. Please install Talisman, SubWallet, or Polkadot.js extension."
        );
      }

      let wallet: Wallet | undefined;

      if (walletName) {
        wallet = installedWallets.find((w) => w.extensionName === walletName);
        if (!wallet) {
          throw new Error(walletName + " wallet not found or not installed.");
        }
      } else {
        // Prefer Talisman, then SubWallet, then any other
        wallet = installedWallets.find((w) => w.extensionName === "talisman") ||
          installedWallets.find((w) => w.extensionName === "subwallet-js") ||
          installedWallets[0];
      }

      console.log("[Polkadot] Using wallet:", wallet.title);

      await wallet.enable(APP_NAME);

      return new Promise<void>((resolve, reject) => {
        wallet!.subscribeAccounts((accounts) => {
          if (!accounts || accounts.length === 0) {
            setPolkadotError("No accounts found in wallet. Please create an account first.");
            setIsConnectingPolkadot(false);
            reject(new Error("No accounts found"));
            return;
          }

          const firstAccount = accounts[0];

          setPolkadot({
            address: firstAccount.address,
            connected: true,
            name: firstAccount.name || wallet!.title,
            account: firstAccount,
            accounts,
            wallet: wallet!,
          });

          localStorage.setItem(STORAGE_KEYS.POLKADOT_WALLET, wallet!.extensionName);
          localStorage.setItem(STORAGE_KEYS.POLKADOT_ADDRESS, firstAccount.address);

          console.log("[Polkadot] Connected successfully:", firstAccount.address);
          setIsConnectingPolkadot(false);
          resolve();
        });
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect Polkadot wallet";
      console.error("[Polkadot] Connection error:", message);
      setPolkadotError(message);
      setPolkadot(defaultPolkadotWallet);
      setIsConnectingPolkadot(false);
    }
  }, []);

  const disconnectPolkadot = useCallback(() => {
    setPolkadot(defaultPolkadotWallet);
    setPolkadotError(null);
    localStorage.removeItem(STORAGE_KEYS.POLKADOT_WALLET);
    localStorage.removeItem(STORAGE_KEYS.POLKADOT_ADDRESS);
    console.log("[Polkadot] Disconnected");
  }, []);

  const selectPolkadotAccount = useCallback((account: WalletAccount) => {
    setPolkadot((prev) => ({
      ...prev,
      address: account.address,
      name: account.name || prev.wallet?.title || null,
      account,
    }));
    localStorage.setItem(STORAGE_KEYS.POLKADOT_ADDRESS, account.address);
    console.log("[Polkadot] Selected account:", account.address);
  }, []);

  // ============================================
  // Utility Functions
  // ============================================

  const disconnectAll = useCallback(() => {
    disconnectEVM();
    disconnectPolkadot();
    console.log("[Wallet] All wallets disconnected");
  }, [disconnectEVM, disconnectPolkadot]);

  const areBothConnected = useCallback(() => {
    return evm.connected && actualPolkadot.connected;
  }, [evm.connected, actualPolkadot.connected]);

  // ============================================
  // Demo Mode Functions
  // ============================================

  const enableDemoMode = useCallback(() => {
    console.log("[Demo] Enabling demo mode with test addresses");
    setDemoEvm({
      address: DEMO_EVM_ADDRESS,
      connected: true,
      chainId: 1,
      walletName: "Demo Wallet",
    });
    setDemoPolkadot({
      address: DEMO_POLKADOT_ADDRESS,
      connected: true,
      name: "Demo Account",
      account: null,
      accounts: [],
      wallet: null,
    });
    setIsDemoMode(true);
  }, []);

  const disableDemoMode = useCallback(() => {
    console.log("[Demo] Disabling demo mode");
    setDemoEvm(defaultEVMWallet);
    setDemoPolkadot(defaultPolkadotWallet);
    setIsDemoMode(false);
  }, []);

  // ============================================
  // Context Value
  // ============================================

  const value: WalletContextType = {
    evm,
    polkadot: actualPolkadot,
    isConnectingEVM: isDemoMode ? false : isConnectingEVM,
    isConnectingPolkadot: isDemoMode ? false : isConnectingPolkadot,
    evmError: isDemoMode ? null : evmError,
    polkadotError: isDemoMode ? null : polkadotError,
    availableWallets,
    availableEVMWallets,
    connectEVM,
    connectPolkadot,
    disconnectEVM,
    disconnectPolkadot,
    disconnectAll,
    selectPolkadotAccount,
    areBothConnected,
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    showEVMModal,
    setShowEVMModal,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// ============================================
// Custom Hook
// ============================================

export const useWallet = () => useContext(WalletContext);

// ============================================
// Utility: Truncate Address for Display
// ============================================

export const truncateAddress = (
  address: string,
  startChars = 6,
  endChars = 4
): string => {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;
  return address.slice(0, startChars) + "..." + address.slice(-endChars);
};

// ============================================
// EVM Wallet Selection Modal Component
// ============================================

export const EVMWalletModal = () => {
  const { showEVMModal, setShowEVMModal, availableEVMWallets, connectEVM, isConnectingEVM } = useWallet();

  if (!showEVMModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowEVMModal(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
          <button
            onClick={() => setShowEVMModal(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Connect your EVM wallet (Trust Wallet / MetaMask)
        </p>

        <div className="space-y-3">
          {availableEVMWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => connectEVM(wallet.id)}
              disabled={isConnectingEVM}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${wallet.installed
                  ? "border-gray-200 hover:border-rose-500 hover:bg-rose-50"
                  : "border-dashed border-gray-300 hover:border-gray-400"
                } ${isConnectingEVM ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-2xl">{wallet.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{wallet.name}</div>
                <div className="text-xs text-gray-500">
                  {wallet.installed ? "Detected" : "Not installed - click to open"}
                </div>
              </div>
              {wallet.installed && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          On mobile? Open this page in your wallet's built-in browser.
        </p>
      </div>
    </div>
  );
};

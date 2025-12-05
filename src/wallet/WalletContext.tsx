import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { getWallets, type Wallet, type WalletAccount } from "@talismn/connect-wallets";
import {
  isConnected as isFreighterConnected,
  getPublicKey,
  signTransaction,
  setAllowed,
  isAllowed,
} from "@stellar/freighter-api";

// ============================================
// Types & Interfaces
// ============================================

export interface StellarWallet {
  publicKey: string | null;
  connected: boolean;
}

export interface PolkadotWallet {
  address: string | null;
  connected: boolean;
  name: string | null;
  account: WalletAccount | null;
  accounts: WalletAccount[];
  wallet: Wallet | null;
}

interface WalletContextType {
  // Stellar wallet state
  stellar: StellarWallet;
  // Polkadot wallet state (via Talisman)
  polkadot: PolkadotWallet;
  // Loading states
  isConnectingStellar: boolean;
  isConnectingPolkadot: boolean;
  // Error states
  stellarError: string | null;
  polkadotError: string | null;
  // Available Polkadot wallets
  availableWallets: Wallet[];
  // Connection functions
  connectStellar: () => Promise<void>;
  connectPolkadot: (walletName?: string) => Promise<void>;
  disconnectStellar: () => void;
  disconnectPolkadot: () => void;
  disconnectAll: () => void;
  // Polkadot account selection
  selectPolkadotAccount: (account: WalletAccount) => void;
  // Helper to check if both wallets are connected
  areBothConnected: () => boolean;
  // Sign transaction helpers
  signStellarTransaction: (xdr: string) => Promise<string>;
}

const defaultStellarWallet: StellarWallet = {
  publicKey: null,
  connected: false,
};

const defaultPolkadotWallet: PolkadotWallet = {
  address: null,
  connected: false,
  name: null,
  account: null,
  accounts: [],
  wallet: null,
};

export const WalletContext = createContext<WalletContextType>({
  stellar: defaultStellarWallet,
  polkadot: defaultPolkadotWallet,
  isConnectingStellar: false,
  isConnectingPolkadot: false,
  stellarError: null,
  polkadotError: null,
  availableWallets: [],
  connectStellar: async () => {},
  connectPolkadot: async () => {},
  disconnectStellar: () => {},
  disconnectPolkadot: () => {},
  disconnectAll: () => {},
  selectPolkadotAccount: () => {},
  areBothConnected: () => false,
  signStellarTransaction: async () => "",
});

// ============================================
// Constants
// ============================================

const APP_NAME = "ChainRepute";
const STORAGE_KEYS = {
  STELLAR_CONNECTED: "chainrepute_stellar_connected",
  POLKADOT_WALLET: "chainrepute_polkadot_wallet",
  POLKADOT_ADDRESS: "chainrepute_polkadot_address",
};

// ============================================
// Wallet Provider Component
// ============================================

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // Stellar state
  const [stellar, setStellar] = useState<StellarWallet>(defaultStellarWallet);
  const [isConnectingStellar, setIsConnectingStellar] = useState(false);
  const [stellarError, setStellarError] = useState<string | null>(null);

  // Polkadot state
  const [polkadot, setPolkadot] = useState<PolkadotWallet>(defaultPolkadotWallet);
  const [isConnectingPolkadot, setIsConnectingPolkadot] = useState(false);
  const [polkadotError, setPolkadotError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);

  // ============================================
  // Initialize available wallets on mount
  // ============================================

  useEffect(() => {
    const wallets = getWallets();
    const installed = wallets.filter((w) => w.installed);
    setAvailableWallets(installed);
    console.log("[WalletContext] Available wallets:", installed.map((w) => w.title));
  }, []);

  // ============================================
  // Auto-reconnect on mount
  // ============================================

  useEffect(() => {
    const autoReconnect = async () => {
      // Auto-reconnect Stellar
      const stellarWasConnected = localStorage.getItem(STORAGE_KEYS.STELLAR_CONNECTED);
      if (stellarWasConnected === "true") {
        try {
          const allowed = await isAllowed();
          if (allowed) {
            const connected = await isFreighterConnected();
            if (connected) {
              const publicKey = await getPublicKey();
              if (publicKey) {
                setStellar({ publicKey, connected: true });
                console.log("[Stellar] Auto-reconnected:", publicKey);
              }
            }
          }
        } catch (err) {
          console.warn("[Stellar] Auto-reconnect failed:", err);
          localStorage.removeItem(STORAGE_KEYS.STELLAR_CONNECTED);
        }
      }

      // Auto-reconnect Polkadot/Talisman
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

    autoReconnect();
  }, []);

  // ============================================
  // Stellar (Freighter) Connection
  // ============================================

  const connectStellar = useCallback(async () => {
    console.log("[Stellar] Starting connection...");
    setIsConnectingStellar(true);
    setStellarError(null);

    try {
      // Check if Freighter is installed
      const connected = await isFreighterConnected();
      
      if (!connected) {
        throw new Error(
          "Freighter wallet not found. Please install the Freighter extension."
        );
      }

      // Request permission
      await setAllowed();

      // Check if allowed
      const allowed = await isAllowed();
      if (!allowed) {
        throw new Error("Connection rejected. Please allow ChainRepute in Freighter.");
      }

      // Get public key
      const publicKey = await getPublicKey();
      
      if (!publicKey) {
        throw new Error("Failed to get public key from Freighter.");
      }

      setStellar({
        publicKey,
        connected: true,
      });

      localStorage.setItem(STORAGE_KEYS.STELLAR_CONNECTED, "true");
      console.log("[Stellar] Connected successfully:", publicKey);

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect Stellar wallet";
      console.error("[Stellar] Connection error:", message);
      setStellarError(message);
      setStellar(defaultStellarWallet);
    } finally {
      setIsConnectingStellar(false);
    }
  }, []);

  const disconnectStellar = useCallback(() => {
    setStellar(defaultStellarWallet);
    setStellarError(null);
    localStorage.removeItem(STORAGE_KEYS.STELLAR_CONNECTED);
    console.log("[Stellar] Disconnected");
  }, []);

  const signStellarTransaction = useCallback(async (xdr: string): Promise<string> => {
    if (!stellar.connected) {
      throw new Error("Stellar wallet not connected");
    }
    const signedXdr = await signTransaction(xdr);
    return signedXdr;
  }, [stellar.connected]);

  // ============================================
  // Polkadot (Talisman/SubWallet/etc) Connection
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

      // Find the specified wallet or use first available
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

      // Enable the wallet
      await wallet.enable(APP_NAME);

      // Subscribe to accounts
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
    disconnectStellar();
    disconnectPolkadot();
    console.log("[Wallet] All wallets disconnected");
  }, [disconnectStellar, disconnectPolkadot]);

  const areBothConnected = useCallback(() => {
    return stellar.connected && polkadot.connected;
  }, [stellar.connected, polkadot.connected]);

  // ============================================
  // Context Value
  // ============================================

  const value: WalletContextType = {
    stellar,
    polkadot,
    isConnectingStellar,
    isConnectingPolkadot,
    stellarError,
    polkadotError,
    availableWallets,
    connectStellar,
    connectPolkadot,
    disconnectStellar,
    disconnectPolkadot,
    disconnectAll,
    selectPolkadotAccount,
    areBothConnected,
    signStellarTransaction,
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

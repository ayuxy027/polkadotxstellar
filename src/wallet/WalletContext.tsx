import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { ethers } from "ethers";
import { getWallets } from "@talismn/connect-wallets";

interface AccountType {
  address?: string;
  balance?: string;
  chainId?: string;
  network?: string;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

interface WalletContextType {
  accountData: AccountType;
  connectWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>({
  accountData: {},
  connectWallet: async () => {},
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountData, setAccountData] = useState<AccountType>({});
  const talismanWallets = getWallets();
  const installedWallets = talismanWallets.filter((wallet) => wallet.installed);

  const talismanWallet = installedWallets.find(
    (wallet) => wallet.extensionName === "talisman"
  );

  if (talismanWallet) {
    talismanWallet.enable("myCoolDapp").then(() => {
      talismanWallet.subscribeAccounts((accounts) => {
        // do anything you want with the accounts provided by the wallet
        console.log("got accounts", accounts);
      });
    });
  }

  console.log("Talisman Wallets: ", installedWallets);
  console.log("Account Data: ", accountData);
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    try {
      // Directly request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        console.log("No authorized accounts found");
        return;
      }

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      setAccountData({
        address,
        balance: ethers.formatEther(balance),
        chainId: network.chainId.toString(),
        network: network.name,
      });

      console.log("Connected to MetaMask:", address);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error connecting to MetaMask: ${message}`);
    }
  }, []);
  const value = {
    accountData,
    connectWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
export const useWallet = () => useContext(WalletContext);

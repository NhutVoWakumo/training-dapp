"use client";

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ethers, toBigInt, formatEther } from "ethers";

// Type alias for a record where the keys are wallet identifiers and the values are account
// addresses or null.
type SelectedAccountByWallet = Record<string, string | null>;

// Context interface for the EIP-6963 provider.
interface WalletProviderContext {
  wallets: Record<string, EIP6963ProviderDetail>; // A list of wallets.
  selectedWallet: EIP6963ProviderDetail | null; // The selected wallet.
  selectedAccount: string | null; // The selected account address.
  errorMessage: string | null; // An error message.
  connectWallet: (walletUuid: string) => Promise<void>; // Function to connect wallets.
  disconnectWallet: () => void; // Function to disconnect wallets.
  clearError: () => void;
  getAccountBalance: (
    walletProvider: EIP1193Provider,
    address: string
  ) => Promise<string>;
}

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
  interface Window {
    ethereum?: any;
  }
}

const initialValue: WalletProviderContext = {
  wallets: {},
  selectedWallet: null,
  selectedAccount: null,
  errorMessage: null,
  connectWallet: async (walletUuid: string) => {},
  disconnectWallet: () => {},
  clearError: () => {},
  getAccountBalance: async (
    walletProvider: EIP1193Provider,
    address: string
  ) => {
    return "";
  },
};

export const WalletProviderContext =
  createContext<WalletProviderContext>(initialValue);

// The WalletProvider component wraps all other components in the dapp, providing them with the
// necessary data and functions related to wallets.
export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [wallets, setWallets] = useState<Record<string, EIP6963ProviderDetail>>(
    {}
  );
  const [selectedWalletRdns, setSelectedWalletRdns] = useState<string | null>(
    null
  );
  const [selectedAccountByWalletRdns, setSelectedAccountByWalletRdns] =
    useState<SelectedAccountByWallet>({});

  const [errorMessage, setErrorMessage] = useState("");
  const clearError = () => setErrorMessage("");
  const setError = (error: string) => setErrorMessage(error);

  useEffect(() => {
    const savedSelectedWalletRdns = localStorage.getItem("selectedWalletRdns");
    const savedSelectedAccountByWalletRdns = localStorage.getItem(
      "selectedAccountByWalletRdns"
    );

    if (savedSelectedAccountByWalletRdns) {
      setSelectedAccountByWalletRdns(
        JSON.parse(savedSelectedAccountByWalletRdns)
      );
    }

    function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
      setWallets((currentWallets) => ({
        ...currentWallets,
        [event.detail.info.rdns]: event.detail,
      }));

      if (
        savedSelectedWalletRdns &&
        event.detail.info.rdns === savedSelectedWalletRdns
      ) {
        setSelectedWalletRdns(savedSelectedWalletRdns);
      }
    }

    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () =>
      window.removeEventListener("eip6963:announceProvider", onAnnouncement);
  }, []);

  const handleAccountChange = useCallback(
    (accounts: string[]) => {
      if (accounts.length <= 0) return;

      const account = accounts[0];

      setSelectedAccountByWalletRdns((currentAccounts) => ({
        ...currentAccounts,
        [selectedWalletRdns as string]: account,
      }));

      localStorage.setItem(
        "selectedAccountByWalletRdns",
        JSON.stringify({
          ...selectedAccountByWalletRdns,
          [selectedWalletRdns as string]: account,
        })
      );
    },
    [selectedAccountByWalletRdns, selectedWalletRdns]
  );

  useEffect(() => {
    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("accountsChanged", (accounts: string[]) =>
      handleAccountChange(accounts)
    );

    return () => {
      window.ethereum.off("chainChanged", () => window.location.reload());
      window.ethereum.off("accountsChanged", (accounts: string[]) =>
        handleAccountChange(accounts)
      );
    };
  }, [handleAccountChange]);

  const connectWallet = useCallback(
    async (walletRdns: string) => {
      console.log("connecting");
      try {
        const wallet = wallets[walletRdns];
        const accounts = (await wallet.provider.request({
          method: "eth_requestAccounts",
        })) as string[];

        if (accounts?.[0]) {
          setSelectedWalletRdns(wallet.info.rdns);
          setSelectedAccountByWalletRdns((currentAccounts) => ({
            ...currentAccounts,
            [wallet.info.rdns]: accounts[0],
          }));

          localStorage.setItem("selectedWalletRdns", wallet.info.rdns);
          localStorage.setItem(
            "selectedAccountByWalletRdns",
            JSON.stringify({
              ...selectedAccountByWalletRdns,
              [wallet.info.rdns]: accounts[0],
            })
          );
        }
      } catch (error) {
        console.error("Failed to connect to provider:", error);
        const walletError: WalletError = error as WalletError;
        setError(
          `Code: ${walletError.code} \nError Message: ${walletError.message}`
        );
      }
    },
    [wallets, selectedAccountByWalletRdns]
  );

  const getAccountBalance = useCallback(
    async (walletProvider: EIP1193Provider, address: string) => {
      try {
        if (!address) return "0";

        const balance = (await walletProvider.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })) as string;
        const weiValue = BigInt(balance);

        return formatEther(weiValue);
      } catch (error) {
        console.error("Failed to get balance:", error);
        return "0";
      }
    },
    []
  );

  const disconnectWallet = useCallback(async () => {
    if (selectedWalletRdns) {
      setSelectedAccountByWalletRdns((currentAccounts) => ({
        ...currentAccounts,
        [selectedWalletRdns]: null,
      }));

      const wallet = wallets[selectedWalletRdns];
      setSelectedWalletRdns(null);
      localStorage.removeItem("selectedWalletRdns");

      try {
        await wallet.provider.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      } catch (error) {
        console.error("Failed to revoke permissions:", error);
      }
    }
  }, [selectedWalletRdns, wallets]);

  const contextValue: WalletProviderContext = {
    wallets,
    selectedWallet:
      selectedWalletRdns === null ? null : wallets[selectedWalletRdns],
    selectedAccount:
      selectedWalletRdns === null
        ? null
        : selectedAccountByWalletRdns[selectedWalletRdns],
    errorMessage,
    connectWallet,
    disconnectWallet,
    clearError,
    getAccountBalance,
  };

  return (
    <WalletProviderContext.Provider value={contextValue}>
      {children}
    </WalletProviderContext.Provider>
  );
};

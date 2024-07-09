"use client";

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { formatEther } from "ethers";

type SelectedAccountByWallet = Record<string, string | null>;

interface WalletProviderContext {
  wallets: Record<string, EIP6963ProviderDetail>;
  selectedWallet: EIP6963ProviderDetail | null;
  selectedAccount: string | null;
  errorMessage: string | null;
  chainId: string;
  globalLoading: boolean;

  connectWallet: (walletUuid: string) => Promise<void>;
  disconnectWallet: () => void;
  triggerLoading: (loading: boolean) => void;
  clearError: () => void;
  processErrorMessage: (error: any) => void;
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
  chainId: "",
  globalLoading: false,

  connectWallet: async (walletUuid: string) => {},
  disconnectWallet: () => {},
  triggerLoading: (loading: boolean) => {},
  clearError: () => {},
  processErrorMessage: (error: any) => {},
  getAccountBalance: async (
    walletProvider: EIP1193Provider,
    address: string
  ) => {
    return "";
  },
};

export const WalletProviderContext =
  createContext<WalletProviderContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [wallets, setWallets] = useState<Record<string, EIP6963ProviderDetail>>(
    {}
  );
  const [selectedWalletRdns, setSelectedWalletRdns] = useState<string | null>(
    null
  );
  const [selectedAccountByWalletRdns, setSelectedAccountByWalletRdns] =
    useState<SelectedAccountByWallet>({});
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const clearError = () => setErrorMessage("");
  const triggerLoading = (value: boolean) => setLoading(value);

  const processErrorMessage = useCallback((error: any) => {
    const walletError: WalletError = error as WalletError;
    setErrorMessage(`${walletError.message}`);
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

  const getChainId = useCallback(async () => {
    if (!window.ethereum) return "";

    setLoading(true);
    try {
      const chainId = (await window.ethereum.request({
        method: "eth_chainId",
        params: [],
      })) as string;

      const convertedChainId = BigInt(chainId).toString();

      setSelectedChain(convertedChainId);

      return convertedChainId;
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
      return "";
    } finally {
      setLoading(false);
    }
  }, [processErrorMessage]);

  const connectWallet = useCallback(
    async (walletRdns: string) => {
      console.log("connecting");
      setLoading(true);
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
        processErrorMessage(error);
      } finally {
        setLoading(false);
      }
    },
    [wallets, selectedAccountByWalletRdns, processErrorMessage]
  );

  const getAccountBalance = useCallback(
    async (walletProvider: EIP1193Provider, address: string) => {
      setLoading(true);
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
        processErrorMessage(error);
        return "0";
      } finally {
        setLoading(false);
      }
    },
    [processErrorMessage]
  );

  const disconnectWallet = useCallback(async () => {
    if (selectedWalletRdns) {
      setLoading(true);
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
        processErrorMessage(error);
      } finally {
        setLoading(false);
      }
    }
  }, [processErrorMessage, selectedWalletRdns, wallets]);

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

  useEffect(() => {
    getChainId();
  }, [getChainId]);

  const contextValue: WalletProviderContext = {
    wallets,
    selectedWallet:
      selectedWalletRdns === null ? null : wallets[selectedWalletRdns],
    selectedAccount:
      selectedWalletRdns === null
        ? null
        : selectedAccountByWalletRdns[selectedWalletRdns],
    chainId: selectedChain,
    globalLoading: loading,
    triggerLoading,
    errorMessage,
    connectWallet,
    disconnectWallet,
    clearError,
    processErrorMessage,
    getAccountBalance,
  };

  return (
    <WalletProviderContext.Provider value={contextValue}>
      {children}
    </WalletProviderContext.Provider>
  );
};

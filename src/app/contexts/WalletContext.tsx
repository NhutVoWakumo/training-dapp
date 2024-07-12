"use client";

import { BrowserProvider, ethers } from "ethers";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useDisconnect,
  useWalletInfo,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

import { formatRoundEther } from "../utils";

type SelectedAccountByWallet = Record<string, string | null>;

interface WalletProviderContext {
  wallets: Record<string, EIP6963ProviderDetail>;
  selectedWallet: EIP6963ProviderDetail | null;
  selectedAccount: string | null;
  errorMessage: string | null;
  chainId: string;
  globalLoading: boolean;
  currentProvider: any;
  currentBalance: string;

  connectWallet: (walletUuid: string) => Promise<void>;
  disconnectWallet: () => void;
  triggerLoading: (loading: boolean) => void;
  clearError: () => void;
  processErrorMessage: (error: any) => void;
  getAccountBalance: (address: string) => Promise<string>;
}

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}

const initialValue: WalletProviderContext = {
  wallets: {},
  selectedWallet: null,
  selectedAccount: null,
  errorMessage: null,
  chainId: "",
  globalLoading: false,
  currentProvider: undefined,
  currentBalance: "",

  connectWallet: async (walletUuid: string) => {},
  disconnectWallet: () => {},
  triggerLoading: (loading: boolean) => {},
  clearError: () => {},
  processErrorMessage: (error: any) => {},
  getAccountBalance: async (address: string) => {
    return "";
  },
};

export const WalletProviderContext =
  createContext<WalletProviderContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { walletInfo } = useWalletInfo();
  const { disconnect } = useDisconnect();
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
  const [currentProvider, setCurrentProvider] = useState<BrowserProvider>();
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] =
    useState<EIP6963ProviderDetail | null>(null);
  const [currentBalance, setCurrentBalance] = useState<string>("0.0");

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
    if (!currentProvider) return "";

    setLoading(true);
    try {
      const network = await currentProvider?.getNetwork();
      const { chainId } = network;

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
  }, [currentProvider, processErrorMessage]);

  const connectWallet = useCallback(
    async (walletName: string) => {
      setLoading(true);

      try {
        const wallet = wallets[walletName];
        const accounts = (await wallet.provider.request({
          method: "eth_requestAccounts",
        })) as string[];

        if (accounts?.[0]) {
          const ethersProvider = new BrowserProvider(wallet.provider);
          setSelectedWalletRdns(wallet.info.rdns);
          setSelectedAccountByWalletRdns((currentAccounts) => ({
            ...currentAccounts,
            [wallet.info.rdns]: accounts[0],
          }));

          setCurrentProvider(ethersProvider);

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
    [processErrorMessage, wallets, selectedAccountByWalletRdns]
  );

  const getAccountBalance = useCallback(
    async (address: string) => {
      setLoading(true);
      try {
        if (!address || !currentProvider) return "0.0";

        const weiValue = await currentProvider?.getBalance(address);

        const formattedBalance = formatRoundEther(weiValue);
        setCurrentBalance(formattedBalance);

        return formattedBalance;
      } catch (error) {
        console.error("Failed to get balance:", error);
        processErrorMessage(error);
        return "0";
      } finally {
        setLoading(false);
      }
    },
    [currentProvider, processErrorMessage]
  );

  const disconnectWallet = useCallback(async () => {
    if (isConnected) {
      try {
        await disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
        processErrorMessage(error);
      }
    }

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
  }, [
    disconnect,
    isConnected,
    processErrorMessage,
    selectedWalletRdns,
    wallets,
  ]);

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
    if (isConnected && walletProvider) {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);

      setCurrentProvider(ethersProvider);
    }
  }, [isConnected, walletProvider]);

  useEffect(() => {
    getChainId();
  }, [getChainId]);

  useEffect(() => {
    if (currentAccount) {
      getAccountBalance(currentAccount);
    }
  }, [currentAccount, getAccountBalance]);

  useEffect(() => {
    if (walletInfo && walletProvider && address) {
      setCurrentAccount(address);
      setCurrentWallet({
        info: walletInfo as any,
        provider: walletProvider as EIP1193Provider,
      });
    } else {
      setCurrentWallet(
        selectedWalletRdns === null ? null : wallets[selectedWalletRdns]
      );
      setCurrentAccount(
        selectedWalletRdns === null
          ? null
          : selectedAccountByWalletRdns[selectedWalletRdns]
      );
    }
  }, [
    address,
    selectedAccountByWalletRdns,
    selectedWalletRdns,
    walletInfo,
    walletProvider,
    wallets,
  ]);

  const contextValue: WalletProviderContext = {
    wallets,
    selectedWallet: currentWallet,
    selectedAccount: currentAccount,
    chainId: selectedChain,
    globalLoading: loading,
    currentProvider,
    currentBalance,
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

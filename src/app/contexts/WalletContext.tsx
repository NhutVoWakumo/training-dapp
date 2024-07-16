"use client";

import { BrowserProvider, ethers } from "ethers";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { capitalizeFirstLetter, formatRoundEther } from "../utils";
import {
  useDisconnect,
  useWalletInfo,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

import { MESSAGE_DURATION } from "../constants";
import Moralis from "moralis";
import { message } from "antd";

interface WalletProviderContext {
  selectedWallet: EIP6963ProviderDetail | null;
  selectedAccount: string | null;
  errorMessage: string | null;
  chainId: string;
  globalLoading: boolean;
  currentProvider: any;
  currentBalance: string;

  disconnectWallet: () => void;
  triggerLoading: (loading: boolean) => void;
  clearError: () => void;
  processErrorMessage: (error: any) => void;
  getNativeCoinBalance: (address: string) => Promise<string>;
  getChainId: () => Promise<string>;
}

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}

const initialValue: WalletProviderContext = {
  selectedWallet: null,
  selectedAccount: null,
  errorMessage: null,
  chainId: "",
  globalLoading: false,
  currentProvider: undefined,
  currentBalance: "",

  disconnectWallet: () => {},
  triggerLoading: (loading: boolean) => {},
  clearError: () => {},
  processErrorMessage: (error: any) => {},
  getNativeCoinBalance: async (address: string) => {
    return "";
  },
  getChainId: async () => "",
};

export const WalletProviderContext =
  createContext<WalletProviderContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { walletInfo } = useWalletInfo();
  const { disconnect } = useDisconnect();

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
    const curentMessage = walletError.shortMessage ?? walletError.message;

    if (!curentMessage) return;

    setErrorMessage(`${curentMessage}`);
    message.open({
      content: `${capitalizeFirstLetter(curentMessage)}`,
      duration: MESSAGE_DURATION,
    });
  }, []);

  const getChainId = useCallback(async () => {
    if (!walletProvider) return "";

    setLoading(true);
    try {
      const chainId = await walletProvider.request({ method: "eth_chainId" });

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
  }, [processErrorMessage, walletProvider]);

  const getNativeCoinBalance = useCallback(
    async (address: string) => {
      setLoading(true);
      try {
        if (!address || !walletProvider) return "0.0";

        const weiValue = await walletProvider.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });

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
    [processErrorMessage, walletProvider]
  );

  const resetApp = useCallback(() => {
    setCurrentAccount("");
    setCurrentProvider(undefined);
    setCurrentWallet(null);
    setSelectedChain("");
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      await walletProvider?.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
      await disconnect();
      resetApp();
    } catch (error) {
      console.error("Failed to disconnect:", error);
      processErrorMessage(error);
    }
  }, [disconnect, processErrorMessage, resetApp, walletProvider]);

  useEffect(() => {
    if (walletProvider) {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);

      setCurrentProvider(ethersProvider);
    }
  }, [isConnected, walletProvider]);

  useEffect(() => {
    if (chainId) setSelectedChain(chainId.toString());
  }, [chainId]);

  useEffect(() => {
    if (currentAccount) {
      getNativeCoinBalance(currentAccount);
    }
  }, [currentAccount, chainId, getNativeCoinBalance]);

  useEffect(() => {
    if (walletInfo && walletProvider && address) {
      setCurrentAccount(address);
      setCurrentWallet({
        info: walletInfo as any,
        provider: walletProvider as EIP1193Provider,
      });
    }
  }, [address, walletInfo, walletProvider]);

  useEffect(() => {
    if (!isConnected) resetApp();
  }, [isConnected, resetApp]);

  useEffect(() => {
    Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
    });
  }, []);

  const contextValue: WalletProviderContext = {
    selectedWallet: currentWallet,
    selectedAccount: currentAccount,
    chainId: selectedChain,
    globalLoading: loading,
    currentProvider,
    currentBalance,
    triggerLoading,
    errorMessage,
    disconnectWallet,
    clearError,
    processErrorMessage,
    getNativeCoinBalance,
    getChainId,
  };

  return (
    <WalletProviderContext.Provider value={contextValue}>
      {children}
    </WalletProviderContext.Provider>
  );
};

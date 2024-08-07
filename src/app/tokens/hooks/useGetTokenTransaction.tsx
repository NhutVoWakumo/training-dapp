"use client";

import { useCallback, useEffect, useState } from "react";
import { useLoadMoreList, useWalletProvider } from "@/app/hooks";

import Moralis from "moralis";
import { TokenTransaction } from "@/app/interfaces";
import { formatChainAsHex } from "@/app/utils";

interface UseGetTokenTransactionsProps {
  tokenAddress: string;
  pageLimit?: number;
}

export const useGetTokenTransactions = ({
  tokenAddress,
  pageLimit = 10,
}: UseGetTokenTransactionsProps) => {
  const { chainId, processErrorMessage, selectedAccount } = useWalletProvider();
  const { canLoadMore, list, manualSetCanLoadMore, resetProps, setProps } =
    useLoadMoreList<TokenTransaction>();

  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const getSingleTokenTransactions = useCallback(async () => {
    if (!chainId || !selectedAccount) return;
    setLocalLoading(true);

    try {
      const { raw } = await Moralis.EvmApi.token.getWalletTokenTransfers({
        chain: formatChainAsHex(Number(chainId)),
        order: "DESC",
        contractAddresses: [tokenAddress],
        address: selectedAccount,
        limit: pageLimit,
      });

      setProps(raw.result as TokenTransaction[], raw?.cursor);
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
    } finally {
      setLocalLoading(false);
    }
  }, [chainId, processErrorMessage, selectedAccount, setProps, tokenAddress]);

  useEffect(() => {
    resetProps();
    getSingleTokenTransactions();
  }, [getSingleTokenTransactions]);

  return {
    transactionList: list,
    localLoading,
    canLoadMore,
    manualSetCanLoadMore,
    getSingleTokenTransactions,
  };
};

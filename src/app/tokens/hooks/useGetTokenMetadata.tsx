"use client";

import { useCallback, useEffect, useState } from "react";

import { ITokenData } from "../interfaces";
import { useERC20Tokens } from "./useERC20Tokens";
import { useWalletProvider } from "@/app/hooks";

export const useGetTokenMetadata = (tokenAddress: string) => {
  const { chainId, selectedAccount } = useWalletProvider();
  const { getSingleTokenMetadata } = useERC20Tokens({
    chainId,
    account: selectedAccount as string,
  });
  const [tokenMetadata, setTokenMetadata] = useState<Partial<ITokenData>>();

  const getAndSetTokenMetadata = useCallback(async () => {
    try {
      const data = await getSingleTokenMetadata(tokenAddress);
      setTokenMetadata(data);
    } catch (error) {
      console.error(error);
    }
  }, [getSingleTokenMetadata, tokenAddress]);

  useEffect(() => {
    getAndSetTokenMetadata();
  }, [getAndSetTokenMetadata]);

  return { tokenMetadata };
};

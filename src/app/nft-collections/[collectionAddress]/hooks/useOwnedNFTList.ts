import { IChainData, OpenseaNFTWithoutTrait } from "@/app/interfaces";
import React, { useCallback, useEffect, useState } from "react";

import { getOpenseaNFTsByAccount } from "../utils";
import { useLoadMoreList } from "@/app/hooks";

interface UseOwnedNFTListProps {
  collectionSlug: string;
  currentChainData: IChainData;
  accountAddress: string;
}

export const useOwnedNFTList = ({
  accountAddress,
  collectionSlug,
  currentChainData,
}: UseOwnedNFTListProps) => {
  const {
    canLoadMore,
    cursor: currentCursor,
    list: ownedNFTList,
    resetProps: resetList,
    setProps,
  } = useLoadMoreList<OpenseaNFTWithoutTrait>();
  const [loading, setLoading] = useState<boolean>(false);

  const getOwnedNFT = useCallback(async () => {
    if (!currentChainData || !collectionSlug || !accountAddress) return;
    setLoading(true);

    try {
      const { data } = await getOpenseaNFTsByAccount(
        accountAddress,
        currentChainData,
        collectionSlug,
        currentCursor,
      );

      const { next, nfts } = data;

      setProps(nfts, next);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    currentChainData,
    collectionSlug,
    accountAddress,
    currentCursor,
    setProps,
  ]);

  useEffect(() => {
    resetList();
    getOwnedNFT();
  }, [accountAddress]);

  return {
    isLoading: loading,
    nftList: ownedNFTList,
    onLoadMore: getOwnedNFT,
    canLoadMore,
    resetList,
  };
};

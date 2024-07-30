import { IChainData, OpenseaNFTWithoutTrait } from "@/app/interfaces";
import React, { useCallback, useEffect, useState } from "react";

import { getOpenseaNFTsByAccount } from "../utils";

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
  const [currentCursor, setCurrentCursor] = useState<string>();
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [ownedNFTList, setOwnedNFTList] = useState<OpenseaNFTWithoutTrait[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);

  const resetList = useCallback(() => {
    setCanLoadMore(true);
    setCurrentCursor(undefined);
    setOwnedNFTList([]);
  }, []);

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

      setCurrentCursor(next);
      setCanLoadMore(!!next);
      setOwnedNFTList((prev) => [...prev, ...nfts]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [accountAddress, currentChainData, currentCursor, collectionSlug]);

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

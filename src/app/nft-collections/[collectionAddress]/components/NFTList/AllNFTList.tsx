"use client";

import { IChainData, OpenseaNFT } from "@/app/interfaces";
import React, { useCallback, useEffect, useState } from "react";

import { NFTList } from "./NFTList";
import { getOpenseaNFTsByContract } from "../../utils";

interface AllNFTListProps {
  slug: string;
  collectionAddress: string;
  chainData?: IChainData;
  nftImageFallback: string;
}

export const AllNFTList = ({
  collectionAddress,
  chainData,
  slug,
  nftImageFallback,
}: AllNFTListProps) => {
  const [currentCursor, setCurrentCursor] = useState<string>();
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [allNFTList, setAllNFTList] = useState<OpenseaNFT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const resetList = useCallback(() => {
    setCanLoadMore(true);
    setCurrentCursor(undefined);
    setAllNFTList([]);
  }, []);

  const getAllNFT = useCallback(async () => {
    if (!chainData || !slug || !canLoadMore) return;
    setLoading(true);

    try {
      const { data } = await getOpenseaNFTsByContract(
        collectionAddress,
        chainData,
        currentCursor,
      );

      const { next, nfts } = data;

      setCurrentCursor(next);
      setCanLoadMore(!!next);
      setAllNFTList((prev) => [...prev, ...nfts]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [canLoadMore, chainData, collectionAddress, currentCursor, slug]);

  useEffect(() => {
    resetList();
    getAllNFT();
  }, []);

  return (
    <div>
      <NFTList
        dataList={allNFTList}
        isLoading={loading}
        canLoadMore={canLoadMore}
        onLoadMore={() => getAllNFT()}
        nftImageFallback={nftImageFallback}
      />
    </div>
  );
};

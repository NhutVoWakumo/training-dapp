"use client";

import { IChainData, OpenseaNFTWithoutTrait } from "@/app/interfaces";
import React, { useCallback, useEffect, useState } from "react";

import { NFTList } from "./NFTList";
import { getOpenseaNFTsByContract } from "../../utils";
import { useLoadMoreList } from "@/app/hooks";

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
  const [loading, setLoading] = useState<boolean>(false);
  const {
    canLoadMore,
    cursor,
    list: allNFTList,
    resetProps: resetList,
    setProps,
  } = useLoadMoreList<OpenseaNFTWithoutTrait>();

  const getAllNFT = useCallback(async () => {
    if (!chainData || !slug || !canLoadMore) return;
    setLoading(true);

    try {
      const { data } = await getOpenseaNFTsByContract(
        collectionAddress,
        chainData,
        cursor,
      );

      const { next, nfts } = data;

      setProps(nfts, next);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [canLoadMore, chainData, collectionAddress, cursor, setProps, slug]);

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

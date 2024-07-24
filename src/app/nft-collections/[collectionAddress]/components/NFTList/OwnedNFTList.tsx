import { IChainData, OpenseaNFT } from "@/app/interfaces";
import React, { useCallback, useEffect, useState } from "react";

import { NFTList } from "./NFTList";
import { getOpenseaNFTsByAccount } from "../../utils";

interface OwnedNFTListProps {
  accountAddress: string;
  slug: string;
  chainData?: IChainData;
  nftImageFallback: string;
}

export const OwnedNFTList = ({
  accountAddress,
  nftImageFallback,
  slug,
  chainData,
}: OwnedNFTListProps) => {
  const [currentCursor, setCurrentCursor] = useState<string>();
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [ownedNFTList, setOwnedNFTList] = useState<OpenseaNFT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const resetList = useCallback(() => {
    setCanLoadMore(true);
    setCurrentCursor(undefined);
    setOwnedNFTList([]);
  }, []);

  const getOwnedNFT = useCallback(async () => {
    if (!chainData || !slug || !canLoadMore || !accountAddress) return;
    setLoading(true);

    try {
      const { data } = await getOpenseaNFTsByAccount(
        accountAddress,
        chainData,
        slug,
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
  }, [accountAddress, canLoadMore, chainData, currentCursor, slug]);

  useEffect(() => {
    resetList();
    getOwnedNFT();
  }, []);

  return (
    <div>
      <NFTList
        dataList={ownedNFTList}
        isLoading={loading}
        canLoadMore={canLoadMore}
        onLoadMore={() => getOwnedNFT()}
        nftImageFallback={nftImageFallback}
      />
    </div>
  );
};

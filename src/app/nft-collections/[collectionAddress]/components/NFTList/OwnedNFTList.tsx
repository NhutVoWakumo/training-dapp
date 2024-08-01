import { IChainData } from "@/app/interfaces";
import { NFTList } from "./NFTList";
import React from "react";
import { useOwnedNFTList } from "../../hooks/useOwnedNFTList";

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
  const { canLoadMore, isLoading, nftList, onLoadMore } = useOwnedNFTList({
    collectionSlug: slug,
    currentChainData: chainData as IChainData,
    accountAddress,
  });

  return (
    <div>
      <NFTList
        dataList={nftList}
        isLoading={isLoading}
        canLoadMore={canLoadMore}
        onLoadMore={onLoadMore}
        nftImageFallback={nftImageFallback}
      />
    </div>
  );
};

import { useCallback, useEffect, useState } from "react";
import { useLoadMoreList, useWalletProvider } from "@/app/hooks";

import { INFTCollection } from "@/app/interfaces";
import Moralis from "moralis";
import { formatChainAsHex } from "@/app/utils";

interface UseGetNFTCollectionsProps {
  pageLimit?: number;
}

export const useGetNFTCollections = ({
  pageLimit = 10,
}: UseGetNFTCollectionsProps) => {
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const { chainId, selectedAccount, triggerLoading, processErrorMessage } =
    useWalletProvider();
  const {
    canLoadMore,
    cursor: currentCursor,
    list: collectionList,
    resetProps: resetNFTList,
    setProps,
    manualSetCanLoadMore,
  } = useLoadMoreList<INFTCollection>();

  const getNFTCollectionList = useCallback(async () => {
    if (!chainId || !selectedAccount) return;

    setLocalLoading(true);
    triggerLoading(true);

    try {
      const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
        chain: formatChainAsHex(Number(chainId)),
        tokenCounts: true,
        address: selectedAccount,
        limit: pageLimit,
        cursor: currentCursor,
      });

      const { raw } = response;
      const { result, cursor } = raw;

      const newCollectionList = result.map((item) => ({
        tokenAddress: item.token_address,
        contractType: item.contract_type,
        name: item.name,
        symbol: item.symbol,
        ownedNFTCount: item?.count ?? 0,
        collectionLogo: item?.collection_logo,
        collectionBannerImage: item?.collection_banner_image,
      }));

      setProps(newCollectionList, cursor);
    } catch (error) {
      console.error(error);
      processErrorMessage(error);

      if (!collectionList.length) manualSetCanLoadMore(false);
    } finally {
      setLocalLoading(false);
      triggerLoading(false);
    }
  }, [
    chainId,
    collectionList,
    currentCursor,
    manualSetCanLoadMore,
    pageLimit,
    processErrorMessage,
    selectedAccount,
    setProps,
    triggerLoading,
  ]);

  useEffect(() => {
    resetNFTList();
    getNFTCollectionList();
  }, [chainId, selectedAccount]);

  return {
    collectionList,
    getNFTCollectionList,
    loading: localLoading,
    canLoadMore,
  };
};

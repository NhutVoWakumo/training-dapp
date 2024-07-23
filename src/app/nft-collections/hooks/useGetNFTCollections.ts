import { useCallback, useEffect, useState } from "react";

import { INFTCollection } from "@/app/interfaces";
import Moralis from "moralis";
import { formatChainAsHex } from "@/app/utils";
import { useWalletProvider } from "@/app/hooks";

interface UseGetNFTCollectionsProps {
  pageLimit?: number;
}

export const useGetNFTCollections = ({
  pageLimit = 10,
}: UseGetNFTCollectionsProps) => {
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [collectionList, setCollectionList] = useState<INFTCollection[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string>();
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>();
  const { chainId, selectedAccount, triggerLoading, processErrorMessage } =
    useWalletProvider();

  const resetNFTList = useCallback(() => {
    setCollectionList([]);
    setCurrentCursor(undefined);
    setCanLoadMore(true);
  }, []);

  const getNFTCollectionList = useCallback(async () => {
    if (!chainId || !selectedAccount || !canLoadMore) return;

    setLocalLoading(true);
    triggerLoading(true);

    try {
      const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
        chain: formatChainAsHex(Number(chainId)),
        tokenCounts: true,
        address: selectedAccount,
        cursor: currentCursor,
        limit: pageLimit,
      });

      const { raw } = response;
      const { result, cursor, total } = raw;

      setCanLoadMore(!!cursor);
      setCurrentCursor(cursor);
      setTotalCount(total);

      result.forEach((item) => {
        setCollectionList((prevList) => [
          ...prevList,
          {
            tokenAddress: item.token_address,
            contractType: item.contract_type,
            name: item.name,
            symbol: item.symbol,
            ownedNFTCount: item?.count ?? 0,
            collectionLogo: item?.collection_logo,
            collectionBannerImage: item?.collection_banner_image,
          },
        ]);
      });
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
    } finally {
      setLocalLoading(false);
      triggerLoading(false);
    }
  }, [
    canLoadMore,
    chainId,
    currentCursor,
    pageLimit,
    processErrorMessage,
    selectedAccount,
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
    totalCount,
  };
};

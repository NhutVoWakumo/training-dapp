"use client";

import { Avatar, Divider, Image, List, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { formatChainAsHex, parseIPFSToNormalUrl } from "../utils";

import InfiniteScroll from "react-infinite-scroll-component";
import Moralis from "moralis";
import { NFTData } from "../interfaces";
import axios from "axios";
import { useWalletProvider } from "../hooks";

export const NFTList = () => {
  const [nftList, setNFTList] = useState<NFTData[]>([]);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [currentCursor, setCurrentCursor] = useState<string>();

  const { chainId, selectedAccount } = useWalletProvider();

  const parseNFTMetadata = useCallback(
    async (metadata?: string, tokenUri?: string) => {
      try {
        if (metadata) return JSON.parse(metadata);
        if (tokenUri) {
          const { data: nftData } = await axios.get(
            parseIPFSToNormalUrl(tokenUri)
          );

          return nftData;
        }

        return {};
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getNFTList = useCallback(async () => {
    if (!selectedAccount || localLoading || !canLoadMore) return;

    setLocalLoading(true);
    try {
      const { raw } = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: formatChainAsHex(Number(chainId)),
        limit: 10,
        cursor: currentCursor,
        format: "decimal",
        normalizeMetadata: true,
        mediaItems: false,
        address: selectedAccount,
      });

      if (!raw.cursor) setCanLoadMore(false);

      setCurrentCursor(raw.cursor);

      raw.result.forEach(async (item) => {
        const metadata = await parseNFTMetadata(item.metadata, item.token_uri);

        setNFTList((prevList) => [
          ...prevList,
          {
            name: metadata?.name ?? "N/A",
            description: metadata?.description ?? "N/A",
            attributes: metadata?.attributes ?? [],
            image: metadata?.image,
            address: item.token_address,
            tokenId: item.token_id,
            symbol: item.symbol,
            collectionName: item.name,
          },
        ]);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLocalLoading(false);
    }
  }, [
    canLoadMore,
    chainId,
    currentCursor,
    localLoading,
    parseNFTMetadata,
    selectedAccount,
  ]);

  useEffect(() => {
    setNFTList([]);
    getNFTList();
  }, []);

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: "auto",
      }}
    >
      <InfiniteScroll
        dataLength={nftList.length}
        next={getNFTList}
        hasMore={canLoadMore}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        {!!nftList.length && (
          <List
            itemLayout="vertical"
            dataSource={nftList}
            renderItem={(item) => (
              <List.Item
                key={`${item.address} - ${item.tokenId}`}
                extra={
                  <Image
                    src={parseIPFSToNormalUrl(item.image ?? "")}
                    alt={item.name}
                    height={100}
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar>{item.symbol}</Avatar>}
                  title={item.name}
                  description={item.collectionName}
                />
                <div>{item.description}</div>
              </List.Item>
            )}
          />
        )}
      </InfiniteScroll>
    </div>
  );
};

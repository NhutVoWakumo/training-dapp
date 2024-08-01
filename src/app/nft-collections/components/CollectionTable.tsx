"use client";

import { Chip, User } from "@nextui-org/react";
import { CustomTable, LoadMoreButton } from "@/app/components";
import { EColumnKeys, columns } from "../constants";
import React, { useCallback } from "react";

import { INFTCollection } from "@/app/interfaces";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import Link from "next/link";
import { TOKEN_STANDARDS } from "@/app/constants";
import { jsNumberForAddress } from "react-jazzicon";
import { useGetNFTCollections } from "../hooks";
import { useWalletProvider } from "@/app/hooks";

export const CollectionTable = () => {
  const { canLoadMore, collectionList, getNFTCollectionList, loading } =
    useGetNFTCollections({ pageLimit: 5 });
  const { selectedAccount } = useWalletProvider();

  const renderCell = useCallback(
    (collection: INFTCollection, columnKey: string) => {
      switch (columnKey) {
        case EColumnKeys.NAME:
          return (
            <User
              name={
                <Link
                  href={`${window.location.pathname}/${collection.tokenAddress}`}
                  className="text-xs md:text-base"
                >
                  {collection.name}
                </Link>
              }
              description={collection.symbol}
              avatarProps={{
                src: collection?.collectionBannerImage,
                showFallback: true,
                radius: "sm",
                fallback: (
                  <Jazzicon
                    diameter={50}
                    seed={jsNumberForAddress(collection.tokenAddress)}
                  />
                ),
              }}
            />
          );
        case EColumnKeys.TYPE:
          return (
            <Chip
              size="sm"
              color={
                collection.contractType === TOKEN_STANDARDS.ERC721
                  ? "secondary"
                  : "warning"
              }
            >
              {collection.contractType.toUpperCase()}
            </Chip>
          );
        case EColumnKeys.OWNED_NFTS:
          return <p className="font-semibold">{collection.ownedNFTCount}</p>;
        default:
          return "";
      }
    },
    [],
  );

  return (
    <CustomTable<INFTCollection>
      data={collectionList}
      renderCell={renderCell}
      columns={columns}
      tableProps={{
        "aria-label": "NFT Collections Table",
        removeWrapper: true,
        bottomContent:
          canLoadMore && !loading && !!selectedAccount ? (
            <LoadMoreButton
              isLoading={loading}
              onClick={getNFTCollectionList}
            />
          ) : null,

        classNames: {
          base: "max-h-[520px] md:overflow-x-hidden overflow-x-scroll",
        },
      }}
      tableBodyProps={{
        isLoading: loading,
      }}
    />
  );
};

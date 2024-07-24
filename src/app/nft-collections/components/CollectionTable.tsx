"use client";

import {
  Button,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import React, { useCallback } from "react";

import { GiOpenTreasureChest } from "react-icons/gi";
import { INFTCollection } from "@/app/interfaces";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import Link from "next/link";
import { TOKEN_STANDARDS } from "@/app/constants";
import { columns } from "../constants";
import { jsNumberForAddress } from "react-jazzicon";
import { useGetNFTCollections } from "../hooks";

export const CollectionTable = () => {
  const { canLoadMore, collectionList, getNFTCollectionList, loading } =
    useGetNFTCollections({ pageLimit: 5 });

  const renderCell = useCallback(
    (collection: INFTCollection, columnKey: string) => {
      switch (columnKey) {
        case "name":
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
        case "type":
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
        case "nft":
          return <p className="font-semibold">{collection.ownedNFTCount}</p>;
        default:
          return "";
      }
    },
    [],
  );

  return (
    <div>
      <Table
        aria-label="NFT Collections Table"
        removeWrapper
        bottomContent={
          canLoadMore && !loading ? (
            <div className="flex w-full justify-center">
              <Button
                isLoading={loading}
                variant="flat"
                onClick={getNFTCollectionList}
              >
                Load more
              </Button>
            </div>
          ) : null
        }
        classNames={{
          base: "max-h-[520px] md:overflow-x-hidden overflow-x-scroll",
          table: "min-h-[400px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "name" ? "start" : "center"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={collectionList}
          isLoading={loading}
          loadingContent={
            <Spinner color="warning" label="Finding treasure..." />
          }
          emptyContent={
            <div className="flex w-full flex-col items-center justify-center gap-5">
              <GiOpenTreasureChest size={70} />
              <p className="text-gray text-lg font-medium">
                Let&apos;s make your treasure full
              </p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.tokenAddress}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

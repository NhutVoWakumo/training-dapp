import {
  Button,
  Link,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { IChainData, OpenseaAssetEvent } from "@/app/interfaces";
import React, { useCallback, useEffect, useState } from "react";
import {
  calculateDateFromNow,
  capitalizeFirstLetter,
  convertUnixToDate,
  formatAddress,
  formatReadableDate,
} from "@/app/utils";

import { BiLinkExternal } from "react-icons/bi";
import { GiOpenTreasureChest } from "react-icons/gi";
import { columns } from "../constants";
import { getOpenseaNFTEvent } from "../../utils";

interface NFTEventTableProps {
  chainData: IChainData;
  collectionAddress: string;
  tokenId: string;
}

export const NFTEventTable = ({
  chainData,
  collectionAddress,
  tokenId,
}: NFTEventTableProps) => {
  const [nftEventList, setNFTEventList] = useState<OpenseaAssetEvent[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string>();
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const resetTable = useCallback(() => {
    setCanLoadMore(true);
    setCursor(undefined);
    setNFTEventList([]);
  }, []);

  const renderCell = useCallback(
    (event: OpenseaAssetEvent, columnKey: string) => {
      switch (columnKey) {
        case "type":
          return capitalizeFirstLetter(event.event_type);
        case "from":
          return event.from_address ? formatAddress(event.from_address) : "-";
        case "to":
          return event.to_address ? formatAddress(event.to_address) : "-";
        case "date": {
          const date = convertUnixToDate(event.event_timestamp);
          return (
            <Tooltip
              content={formatReadableDate(date, "DD/MM/YYYY[, at] HH:mm:ss")}
            >
              <Link
                isExternal
                isDisabled={!event.transaction}
                href={`${chainData?.explorers?.[0]?.url}/tx/${event.transaction}`}
                className="flex w-full items-center justify-center gap-1"
              >
                <p className="truncate">{calculateDateFromNow(date)}</p>
                <BiLinkExternal size={16} />
              </Link>
            </Tooltip>
          );
        }
        default:
          return "";
      }
    },
    [chainData?.explorers],
  );

  const getNFTEventList = useCallback(async () => {
    if (!chainData || !collectionAddress || !tokenId || !canLoadMore) return;
    setLocalLoading(true);
    try {
      const { data } = await getOpenseaNFTEvent(
        collectionAddress,
        chainData,
        tokenId,
        cursor,
      );

      setCursor(data.next);
      setCanLoadMore(!!data.next);

      setNFTEventList((prev) => [...prev, ...data.asset_events]);
    } catch (error) {
      console.error(error);
    } finally {
      setLocalLoading(false);
    }
  }, [canLoadMore, chainData, collectionAddress, cursor, tokenId]);

  useEffect(() => {
    resetTable();
    getNFTEventList();
  }, []);

  return (
    <div>
      <Table
        aria-label="NFT Collections Table"
        removeWrapper
        bottomContent={
          canLoadMore && !localLoading ? (
            <div className="flex w-full justify-center">
              <Button
                isLoading={localLoading}
                variant="flat"
                onClick={getNFTEventList}
              >
                Load more
              </Button>
            </div>
          ) : null
        }
        classNames={{
          base: "max-h-[520px] md:overflow-x-hidden overflow-x-scroll",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align="center">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={nftEventList}
          isLoading={localLoading}
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
            <TableRow
              key={`${item.transaction}-${item.event_timestamp}-${item.from_address}`}
            >
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

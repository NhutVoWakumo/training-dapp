import { Button, Link, Tooltip } from "@nextui-org/react";
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
import { CustomTable } from "@/app/components";
import { columns } from "../constants";
import { getOpenseaNFTEvent } from "../../utils";
import { useLoadMoreList } from "@/app/hooks";

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
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const {
    canLoadMore,
    cursor,
    list: nftEventList,
    resetProps: resetTable,
    setProps,
  } = useLoadMoreList<OpenseaAssetEvent>();

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

      setProps(data.asset_events, data.next);
    } catch (error) {
      console.error(error);
    } finally {
      setLocalLoading(false);
    }
  }, [canLoadMore, chainData, collectionAddress, cursor, setProps, tokenId]);

  useEffect(() => {
    resetTable();
    getNFTEventList();
  }, []);

  return (
    <CustomTable<OpenseaAssetEvent>
      data={nftEventList}
      columns={columns}
      renderCell={renderCell}
      tableProps={{
        "aria-label": "NFT Collections Table",
        removeWrapper: true,
        bottomContent:
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
          ) : null,
        classNames: {
          base: "max-h-[520px] md:overflow-x-hidden overflow-x-scroll",
        },
      }}
      tableColumnProps={{
        align: "center",
      }}
      tableBodyProps={{
        isLoading: localLoading,
      }}
    />
  );
};

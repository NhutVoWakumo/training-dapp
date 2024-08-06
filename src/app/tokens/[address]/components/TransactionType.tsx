import {
  BiGitCompare,
  BiLeftDownArrowCircle,
  BiQuestionMark,
  BiRightTopArrowCircle,
} from "react-icons/bi";
import { Link, Tooltip, User } from "@nextui-org/react";
import React, { useCallback, useMemo } from "react";
import {
  calculateDateFromNow,
  formatReadableDate,
  getChainData,
} from "@/app/utils";

import { ETransactionType } from "../utils";

interface TransactionTypeProps {
  type: ETransactionType;
  transactionHash: string;
  chainId: string;
  iconSize?: number;
  timestamp?: string;
}

export const TransactionType = ({
  type,
  transactionHash,
  iconSize = 30,
  chainId,
  timestamp,
}: TransactionTypeProps) => {
  const renderIcon = useCallback(() => {
    switch (type) {
      case ETransactionType.MINT:
        return <BiGitCompare size={iconSize} />;

      case ETransactionType.SEND:
        return <BiRightTopArrowCircle size={iconSize} />;
      case ETransactionType.RECEIVE:
        return <BiLeftDownArrowCircle size={iconSize} />;
      default:
        return <BiQuestionMark size={iconSize} />;
    }
  }, [iconSize, type]);

  const currentChainData = useMemo(() => {
    return getChainData(chainId);
  }, [chainId]);

  return (
    <Link
      isExternal
      href={`${currentChainData?.explorers?.[0]?.url}/tx/${transactionHash}`}
      isDisabled={!currentChainData}
      className="w-full justify-start"
    >
      <User
        name={type}
        description={
          timestamp ? (
            <Tooltip content={formatReadableDate(timestamp)} placement="right">
              {calculateDateFromNow(timestamp)}
            </Tooltip>
          ) : (
            "-"
          )
        }
        avatarProps={{
          showFallback: true,
          fallback: renderIcon(),
          className: "bg-transparent",
        }}
        className="min-w-40"
      />
    </Link>
  );
};

"use client";

import { CustomTable, LoadMoreButton } from "@/app/components";
import { EColumnKeys, columns } from "../constants";
import React, { useCallback } from "react";

import { TokenTransaction } from "@/app/interfaces";
import { TransactionType } from "./TransactionType";
import { determineTransactionType } from "../utils";
import { formatAddress } from "@/app/utils";
import { useGetTokenTransactions } from "../../hooks";
import { useWalletProvider } from "@/app/hooks";

interface TokenTransactionTableProps {
  tokenAddress: string;
}

export const TokenTransactionTable = ({
  tokenAddress,
}: TokenTransactionTableProps) => {
  const { selectedAccount, chainId } = useWalletProvider();
  const {
    canLoadMore,
    getSingleTokenTransactions,
    localLoading,
    transactionList,
  } = useGetTokenTransactions({ tokenAddress });
  const renderCell = useCallback(
    (transaction: TokenTransaction, columnKey: string) => {
      switch (columnKey) {
        case EColumnKeys.TYPE: {
          const transactionType = determineTransactionType(
            transaction.from_address,
            transaction.to_address,
            selectedAccount as string,
          );
          return (
            <TransactionType
              type={transactionType}
              transactionHash={transaction.transaction_hash}
              chainId={chainId}
              timestamp={transaction.block_timestamp}
            />
          );
        }
        case EColumnKeys.VALUE:
          return transaction.value_decimal;
        case EColumnKeys.FROM:
          return transaction.from_address
            ? formatAddress(transaction.from_address)
            : "-";
        case EColumnKeys.TO:
          return transaction.to_address
            ? formatAddress(transaction.to_address)
            : "-";
        default:
          return "";
      }
    },
    [chainId, selectedAccount],
  );

  return (
    <div>
      <CustomTable<TokenTransaction>
        data={transactionList}
        columns={columns}
        renderCell={renderCell}
        tableProps={{
          "aria-label": "Token Transaction Table",
          removeWrapper: true,
          bottomContent:
            canLoadMore && !!selectedAccount ? (
              <div className="flex w-full justify-center">
                <LoadMoreButton
                  isLoading={localLoading}
                  variant="flat"
                  onClick={getSingleTokenTransactions}
                />
              </div>
            ) : null,
          classNames: {
            base: "md:overflow-x-hidden overflow-x-scroll",
          },
        }}
        tableColumnProps={{
          align: "center",
          minWidth: "150",
        }}
        tableBodyProps={{
          isLoading: localLoading,
          loadingContent: null,
        }}
      />
    </div>
  );
};

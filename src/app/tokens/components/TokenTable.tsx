"use client";

import {
  AnimatedGradientText,
  CustomPagination,
  CustomTable,
  ReloadButton,
} from "@/app/components";
import React, { useCallback, useMemo, useState } from "react";
import {
  TokenActionCell,
  TokenBalanceCell,
  TokenDataCell,
} from "./TokenTableCell";

import { ITokenData } from "../interfaces";
import { TransferModal } from "@/app/components/Transfer/TransferModal";
import { columns } from "../constants";
import { useDisclosure } from "@nextui-org/react";
import { useERC20Tokens } from "../hooks";
import { useWalletProvider } from "@/app/hooks";

export const TokenTable = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { selectedAccount, chainId, globalLoading, processErrorMessage } =
    useWalletProvider();
  const {
    tokenList,
    importTokenToWallet,
    transferToken,
    refetchAccountBalance,
    getTransactionReceipt,
    loading,
    form,
    getTokenList,
  } = useERC20Tokens({
    chainId,
    account: selectedAccount ?? "",
  });
  const ROW_PER_PAGE = 4;
  const [page, setPage] = useState<number>(1);
  const [currentToken, setCurrentToken] = useState<ITokenData>();

  const items = useMemo(() => {
    const start = (page - 1) * ROW_PER_PAGE;
    const end = start + ROW_PER_PAGE;

    return Object.values(tokenList).slice(start, end);
  }, [page, tokenList]);

  const renderCell = useCallback(
    (token: ITokenData, columnKey: string) => {
      switch (columnKey) {
        case "token":
          return <TokenDataCell token={token} />;

        case "balance":
          return <TokenBalanceCell token={token} />;

        case "actions":
          return (
            <TokenActionCell
              isDisabled={globalLoading}
              onImportClick={() => importTokenToWallet(token)}
              onTransferClick={() => {
                setCurrentToken(token);
                onOpen();
              }}
            />
          );

        default:
          return "";
      }
    },
    [globalLoading, importTokenToWallet, onOpen],
  );

  const onSubmit = useCallback(async () => {
    try {
      await form?.validateFields();
      const hash = await transferToken(currentToken);
      if (hash) {
        await getTransactionReceipt(hash);
        if (selectedAccount && currentToken)
          await refetchAccountBalance(selectedAccount, currentToken);
      }
      onClose();
      form.resetFields();
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
    }
  }, [
    currentToken,
    form,
    getTransactionReceipt,
    onClose,
    processErrorMessage,
    refetchAccountBalance,
    selectedAccount,
    transferToken,
  ]);

  return (
    <div className="my-5 flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <AnimatedGradientText>ERC20 Tokens Table</AnimatedGradientText>
        <ReloadButton
          size="sm"
          isLoading={loading}
          color="warning"
          isDisabled={!selectedAccount}
          onReload={() => getTokenList(selectedAccount as string)}
        />
      </div>
      <CustomTable<ITokenData>
        data={items}
        columns={columns}
        renderCell={renderCell}
        tableProps={{
          "aria-label": "ERC20 Tokens",
          removeWrapper: true,
          bottomContent: (
            <div className="flex w-full justify-center">
              {!!items.length && (
                <CustomPagination
                  dataLength={Object.values(tokenList).length}
                  rowsPerPage={ROW_PER_PAGE}
                  onChange={setPage}
                />
              )}
            </div>
          ),
        }}
        tableColumnProps={{ align: "start" }}
        tableBodyProps={{
          isLoading: loading,
        }}
        tableRowProps={{
          className: "my-2 p-2",
        }}
      />
      <TransferModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onClose={onClose}
        globalLoading={globalLoading}
        form={form}
        currentBalance={
          Object.values(tokenList).find(
            (item) => item.address === currentToken?.address,
          )?.balance
        }
      />
    </div>
  );
};

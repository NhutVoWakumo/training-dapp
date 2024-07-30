"use client";

import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useCallback, useMemo, useState } from "react";
import {
  TokenActionCell,
  TokenBalanceCell,
  TokenDataCell,
} from "./TokenTableCell";

import { BiRefresh } from "react-icons/bi";
import { GiOpenTreasureChest } from "react-icons/gi";
import { ITokenData } from "../interfaces";
import { TransferModal } from "@/app/components/Transfer/TransferModal";
import { columns } from "../constants";
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
  const [page, setPage] = useState<number>(1);
  const [currentToken, setCurrentToken] = useState<ITokenData>();
  const rowsPerPage = 4;

  const pages = useMemo(
    () => Math.ceil(Object.values(tokenList).length / rowsPerPage),
    [tokenList],
  );

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

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
    <div className="my-5 flex flex-col gap-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-3xl font-semibold text-transparent">
          ERC20 Tokens Table
        </p>
        <Button
          size="sm"
          isIconOnly
          isLoading={loading}
          onClick={() => getTokenList(selectedAccount as string)}
          color="warning"
        >
          <BiRefresh size={28} />
        </Button>
      </div>
      <Table
        aria-label="ERC20 Tokens"
        removeWrapper
        bottomContent={
          <div className="flex w-full justify-center">
            {!!items.length && (
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            )}
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={"start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={items}
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
          {items.map((item) => (
            <TableRow key={item.address} className="my-2 p-2">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

"use client";

import {
  AnimatedGradientText,
  CustomPagination,
  CustomTable,
  ReloadButton,
} from "@/app/components";
import { EColumnKeys, PAGE_SIZES, columns } from "../constants";
import React, { useCallback, useMemo, useState } from "react";
import { Select, SelectItem, useDisclosure } from "@nextui-org/react";
import {
  TokenActionCell,
  TokenBalanceCell,
  TokenDataCell,
} from "./TokenTableCell";

import { ITokenData } from "../interfaces";
import { TransferModal } from "@/app/components/Transfer/TransferModal";
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
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [currentToken, setCurrentToken] = useState<ITokenData>();

  const items = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return Object.values(tokenList).slice(start, end);
  }, [page, tokenList, pageSize]);

  const renderCell = useCallback(
    (token: ITokenData, columnKey: string) => {
      switch (columnKey) {
        case EColumnKeys.TOKEN:
          return <TokenDataCell token={token} />;

        case EColumnKeys.BALANCE:
          return <TokenBalanceCell token={token} />;

        case EColumnKeys.ACTIONS:
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
          className={`${selectedAccount ? "block" : "hidden"}`}
        />
      </div>
      <CustomTable<ITokenData>
        data={items}
        columns={columns}
        renderCell={renderCell}
        tableProps={{
          "aria-label": "ERC20 Tokens",
          removeWrapper: true,
          bottomContent: !!items.length && (
            <div className="flex w-full justify-end gap-3">
              <CustomPagination
                dataLength={Object.values(tokenList).length}
                rowsPerPage={pageSize}
                onChange={setPage}
              />
              <Select
                fullWidth={false}
                selectedKeys={[pageSize.toString()]}
                classNames={{
                  mainWrapper: "h-9 w-28",
                  base: "h-9 w-28",
                  trigger: "w-full min-h-9",
                }}
                renderValue={(items) => {
                  return items.map((item, index) => (
                    <div key={index}>{`Size: ${item.textValue}`}</div>
                  ));
                }}
                items={PAGE_SIZES.map((item) => ({ key: item, value: item }))}
                onSelectionChange={(key) => {
                  const isSelected = !!new Set(key).size;
                  if (isSelected) {
                    setPage(1);
                    setPageSize(Number(key["currentKey"]));
                  }
                }}
              >
                {(item) => (
                  <SelectItem key={item.key} textValue={item.value.toString()}>
                    {item.value}
                  </SelectItem>
                )}
              </Select>
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

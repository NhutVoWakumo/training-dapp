"use client";

import {
  Avatar,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Snippet,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  Breakpoint,
  useDetectScreenBreakpoint,
  useWalletProvider,
} from "@/app/hooks";
import { ChainLogo, SymbolLogo } from "@api3/logos";
import React, { useCallback, useMemo } from "react";
import { delay, formatAddress, formatValueToHexWei } from "@/app/utils";

import CountUp from "react-countup";
import { TransferForm } from "../Transfer";
import { chainData } from "@/app/constants";
import { message } from "antd";
import { useForm } from "antd/es/form/Form";

export const CoinBalanceAndChain = () => {
  const {
    currentBalance,
    chainId,
    switchChain,
    selectedAccount,
    processErrorMessage,
    globalLoading,
    infuraProvider,
    selectedWallet,
    triggerLoading,
    getNativeCoinBalance,
  } = useWalletProvider();
  const [form] = useForm();
  const isBelowMdBreakpoint = useDetectScreenBreakpoint(Breakpoint.MD);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const currentChainData = useMemo(() => {
    return chainData.find((chain) => chain.chainId.toString() === chainId);
  }, [chainId]);

  const handleChangeChain = useCallback(
    async (chainId: string) => {
      if (!chainId) return;

      const selectedChain = chainData.find(
        (chain) => chain.chainId.toString() == chainId,
      );

      if (selectedChain) {
        try {
          await switchChain(selectedChain);
        } catch (error) {
          console.error(error);
          processErrorMessage(error);
        }
      }
    },
    [processErrorMessage, switchChain],
  );

  const onTransferFinish = useCallback(async () => {
    // delay 1,5 second before get new balance after transfering
    await delay(1500);
    await getNativeCoinBalance(selectedAccount as string);
    onClose();
    form?.resetFields();
  }, [form, getNativeCoinBalance, onClose, selectedAccount]);

  const handleTransferNativeCoin = useCallback(async () => {
    triggerLoading(true);
    try {
      const { address, value } = await form.validateFields();
      const transactionHash = (await selectedWallet?.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: address,
            from: selectedAccount,
            value: formatValueToHexWei(value.toString()),
          },
        ],
      })) as string;

      const receipt = await infuraProvider?.waitForTransaction(transactionHash);
      console.log(receipt);
      message.success("Transaction completed");

      await onTransferFinish();
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
    } finally {
      triggerLoading(false);
    }
  }, [
    form,
    infuraProvider,
    onTransferFinish,
    processErrorMessage,
    selectedAccount,
    selectedWallet?.provider,
    triggerLoading,
  ]);

  return (
    <div>
      {currentChainData ? (
        <Button
          className="flex items-center bg-transparent"
          radius="full"
          isIconOnly={isBelowMdBreakpoint}
          onClick={onOpen}
        >
          <Tooltip
            content={currentChainData?.name}
            isDisabled={!currentChainData?.name}
          >
            <Avatar
              key={"coin-symbol"}
              src={(ChainLogo(chainId) as any).src}
              radius="full"
              // cannot use "size" as it will be overwrited by w-10 h-10 as default of avatar component
              className="h-8 w-8 text-tiny md:h-6 md:w-6"
            />
          </Tooltip>

          <CountUp
            start={0}
            end={parseFloat(currentBalance)}
            decimals={3}
            suffix={` ${currentChainData?.nativeCurrency.symbol}`}
            className="hidden md:block"
          />
        </Button>
      ) : (
        <Tooltip
          content={
            "Your current chain is not supported, please switch your chain!"
          }
        >
          <Button
            size="sm"
            variant="bordered"
            color="warning"
            onClick={() => switchChain(chainData[0])}
          >
            Switch chain
          </Button>
        </Tooltip>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        isDismissable={!globalLoading}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between pb-0">
                <Snippet
                  codeString={selectedAccount ?? ""}
                  className="bg-transparent p-0"
                  symbol=""
                >
                  {formatAddress(selectedAccount ?? "")}
                </Snippet>
                <Select
                  items={chainData}
                  isDisabled={globalLoading}
                  selectedKeys={[chainId]}
                  selectionMode="single"
                  fullWidth={false}
                  variant="faded"
                  className="w-20"
                  classNames={{
                    listbox: "w-fit",
                    popoverContent: "w-fit",
                  }}
                  renderValue={(items) => {
                    const selectedItem = items[0];
                    return (
                      <Avatar
                        src={
                          (
                            ChainLogo(
                              selectedItem.data?.chainId?.toString() ?? "",
                            ) as any
                          ).src
                        }
                        className="h-6 w-6"
                        radius="full"
                      />
                    );
                  }}
                  onSelectionChange={(key) => {
                    const isSelected = !!new Set(key).size;
                    if (isSelected) handleChangeChain(key["currentKey"] ?? "");
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.chainId.toString()}>
                      <div className="flex flex-row items-center gap-3">
                        <Avatar
                          src={(ChainLogo(item.chainId.toString()) as any).src}
                          className="h-8 w-8 text-tiny"
                          radius="full"
                        />
                        <p className="hidden md:block">{item.name}</p>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </ModalHeader>
              <ModalBody>
                <div className="p-3">
                  <div className="flex h-16 w-full items-center justify-center">
                    <div className="flex items-center gap-2 text-lg">
                      <Avatar
                        src={
                          (
                            SymbolLogo(
                              currentChainData?.nativeCurrency?.symbol ?? "",
                            ) as any
                          ).src
                        }
                        radius="full"
                        size="md"
                      />
                      <CountUp
                        start={0}
                        end={parseFloat(currentBalance)}
                        decimals={3}
                      />
                      <p>{currentChainData?.nativeCurrency.symbol}</p>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div>
                    <p className="mb-4 font-semibold">Transfer</p>
                    <TransferForm
                      currentBalance={currentBalance}
                      form={form}
                      layout="vertical"
                      disabled={globalLoading}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => {
                    form?.resetFields();
                    onClose();
                  }}
                  isDisabled={globalLoading}
                >
                  Close
                </Button>
                <Button
                  color="secondary"
                  onPress={handleTransferNativeCoin}
                  isLoading={globalLoading}
                >
                  Transfer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

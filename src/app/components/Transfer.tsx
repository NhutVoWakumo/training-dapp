"use client";

import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import React, { useCallback, useState } from "react";

import { ethers } from "ethers";
import { formatValueToHexWei } from "../utils";
import { sepoliaChainId } from "../constants";
import { useForm } from "antd/es/form/Form";
import { useWalletProvider } from "../hooks";

export const Transfer = () => {
  const [form] = useForm();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const {
    selectedWallet,
    selectedAccount,
    chainId,
    triggerLoading,
    globalLoading,
    processErrorMessage,
  } = useWalletProvider();

  const handleTransfer = useCallback(async () => {
    if (!selectedWallet || !selectedAccount) return;
    triggerLoading(true);
    try {
      const values = await form?.validateFields();
      const { address, value } = values;
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
      setOpenModal(false);
      console.log(transactionHash);
      if (chainId.toString() === sepoliaChainId) {
        try {
          const provider = new ethers.EtherscanProvider(
            "sepolia",
            process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
          );
          const receipt = await provider.waitForTransaction(transactionHash);
          console.log(receipt);
          message.success("Transaction completed");
        } catch (error) {
          processErrorMessage(error);
        }
      }
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
    } finally {
      setOpenModal(false);
      triggerLoading(false);
    }
  }, [
    selectedWallet,
    selectedAccount,
    triggerLoading,
    form,
    chainId,
    processErrorMessage,
  ]);

  return (
    <>
      {selectedWallet && (
        <>
          <Button onClick={() => setOpenModal(true)} loading={globalLoading}>
            Transfer
          </Button>
          <Modal
            open={openModal}
            onCancel={() => setOpenModal(false)}
            onOk={handleTransfer}
            loading={globalLoading}
          >
            <Form form={form} layout="vertical">
              <Form.Item label={"Address"} name={"address"}>
                <Input />
              </Form.Item>
              <Form.Item label={"Value"} name={"value"}>
                <InputNumber
                  style={{ width: "100%" }}
                  stringMode
                  controls={false}
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </>
  );
};

"use client";

import { Button, Form, Input, InputNumber, Modal } from "antd";
import React, { useCallback, useState } from "react";
import { useWalletProvider } from "../hooks";
import { formatValueToHexWei } from "../utils";
import { useForm } from "antd/es/form/Form";

export const Transfer = () => {
  const [form] = useForm();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { selectedWallet, selectedAccount } = useWalletProvider();

  const handleTransfer = useCallback(async () => {
    if (!selectedWallet || !selectedAccount) return;
    try {
      const values = await form?.validateFields();
      const { address, value } = values;
      const transactionHash = await selectedWallet?.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: address,
            from: selectedAccount,
            value: formatValueToHexWei(value.toString()),
          },
        ],
      });
      console.log(transactionHash);
    } catch (error) {
      console.error(error);
    } finally {
      setOpenModal(false);
    }
  }, [selectedAccount, selectedWallet, form]);

  return (
    <>
      {selectedWallet && (
        <>
          <Button onClick={() => setOpenModal(true)}>Transfer</Button>
          <Modal
            open={openModal}
            onCancel={() => setOpenModal(false)}
            onOk={handleTransfer}
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

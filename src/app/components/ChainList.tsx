import { Form, Modal, ModalProps, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useCallback } from "react";
import { chainData } from "../constants";
import { IChainData } from "../interfaces";
import { useWalletProvider } from "../hooks";

interface ChainListProps extends Omit<ModalProps, "onCancel" | "onOk"> {
  onSwitchChain: (
    provider: EIP1193Provider,
    chain: IChainData
  ) => Promise<void>;
  onCancel?: () => void;
}

export const ChainList = ({
  onSwitchChain,
  onCancel,
  ...props
}: ChainListProps) => {
  const [form] = useForm();
  const { selectedWallet } = useWalletProvider();

  const handleFinish = useCallback(async () => {
    const values = await form?.validateFields();
    const { chainId } = values;

    const chain = chainData.find((item) => item.chainId === chainId);

    console.log("chainId:", chainId);
    console.log("chain:", chain);

    if (!chain) {
      onCancel?.();
      return;
    }

    onSwitchChain(selectedWallet?.provider as EIP1193Provider, chain);
    onCancel?.();
  }, [form, onCancel, onSwitchChain, selectedWallet?.provider]);

  return (
    <Modal {...props} onCancel={onCancel} onOk={handleFinish}>
      <Form form={form} layout="vertical">
        <Form.Item label={"Select Chain"} name="chainId">
          <Select
            options={chainData.map((chain) => ({
              key: chain.chainId,
              label: chain.name,
              value: chain.chainId,
            }))}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

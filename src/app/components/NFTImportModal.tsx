import { Form, Input, InputNumber, Modal, ModalProps } from "antd";

import { FormInstance } from "antd/es/form/Form";
import React from "react";

interface NFTImportModalProps extends ModalProps {
  globalLoading: boolean;
  form: FormInstance;
}

export const NFTImportModal = ({
  globalLoading,
  form,
  ...props
}: NFTImportModalProps) => {
  return (
    <Modal {...props}>
      <Form form={form} layout="vertical" disabled={globalLoading}>
        <Form.Item
          name={"address"}
          label={"Address"}
          rules={[
            {
              required: true,
              message: "Please input Contract address",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"tokenId"}
          label={"Token ID"}
          rules={[
            {
              required: true,
              message: "Please input Token ID",
            },
            {
              pattern: /^[0-9]+$/,
              message: "Please input a valid integer number",
            },
          ]}
        >
          <InputNumber controls={false} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

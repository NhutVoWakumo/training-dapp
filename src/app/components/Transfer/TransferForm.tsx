import { BiDollarCircle, BiSolidWallet } from "react-icons/bi";
import { Form, FormProps } from "antd";

import { Input } from "@nextui-org/react";
import React from "react";
import { isAddress } from "ethers";

interface TransferFormProps extends Omit<FormProps, "children"> {
  currentBalance: string;
}

export const TransferForm = ({
  currentBalance,
  ...props
}: TransferFormProps) => {
  return (
    <Form {...props}>
      <Form.Item
        name={"address"}
        rules={[
          {
            required: true,
            message: "Please input an address",
          },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();

              if (!isAddress(value))
                return Promise.reject(new Error("Invalid address"));

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          isDisabled={props.disabled}
          className="text-white"
          endContent={<BiSolidWallet size={20} />}
          label={"Address"}
          placeholder="Please input address"
          variant="bordered"
          autoFocus
        />
      </Form.Item>
      <Form.Item
        name={"value"}
        rules={[
          {
            required: true,
            message: "Please input value",
          },
          {
            pattern: /^[0-9.]+$/,
            message: "Please input a valid number",
          },
          {
            validator: (_, value) => {
              if (!currentBalance) return Promise.resolve();

              if (!value || parseFloat(value) <= parseFloat(currentBalance)) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error(`Value cannot exceed ${currentBalance}`),
              );
            },
          },
        ]}
      >
        <Input
          isDisabled={props.disabled}
          className="text-white"
          label={"Value"}
          endContent={<BiDollarCircle size={20} />}
          placeholder="Please input value"
          variant="bordered"
        />
      </Form.Item>
    </Form>
  );
};

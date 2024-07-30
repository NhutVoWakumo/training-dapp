import { BiDollarCircle, BiSolidWallet } from "react-icons/bi";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { Form, FormInstance } from "antd";

import React from "react";
import { isAddress } from "ethers";

interface TransferModalProps extends Omit<ModalProps, "children"> {
  globalLoading: boolean;
  currentBalance?: string;
  form: FormInstance;
  onSubmit: () => Promise<void>;
}

export const TransferModal = ({
  form,
  globalLoading,
  currentBalance,
  onSubmit,
  ...props
}: TransferModalProps) => {
  return (
    <Modal hideCloseButton {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Transfer token</ModalHeader>
            <ModalBody>
              <Form form={form} layout="vertical" disabled={globalLoading}>
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

                        if (
                          !value ||
                          parseFloat(value) <= parseFloat(currentBalance)
                        ) {
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
                    className="text-white"
                    label={"Value"}
                    endContent={<BiDollarCircle size={20} />}
                    placeholder="Please input value"
                    variant="bordered"
                  />
                </Form.Item>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="secondary"
                onClick={onSubmit}
                isLoading={globalLoading}
              >
                Transfer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";

import { FormInstance } from "antd";
import React from "react";
import { TransferForm } from "./TransferForm";

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
              <TransferForm
                currentBalance={currentBalance ?? "0"}
                form={form}
                layout="vertical"
                disabled={globalLoading}
              />
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

import {
  Button,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalFooterProps,
  ModalHeader,
  ModalHeaderProps,
  ModalProps,
} from "@nextui-org/react";

import { GiCardPickup } from "react-icons/gi";
import React from "react";

interface RedirectToTableModalProps extends Omit<ModalProps, "children"> {
  onConfirm: () => void;
  modalContentProps?: Omit<ModalContentProps, "children">;
  modalHeaderProps?: Omit<ModalHeaderProps, "children" | "classname">;
  modalBodyProps?: Omit<ModalBodyProps, "children">;
  modalFooterProps?: Omit<ModalFooterProps, "children">;
}

export const RedirectToTableModal = ({
  onConfirm,
  className,
  modalContentProps,
  modalHeaderProps,
  modalBodyProps,
  modalFooterProps,
  ...props
}: RedirectToTableModalProps) => {
  return (
    <Modal backdrop="blur" className={`${className} z-50`} {...props}>
      <ModalContent {...modalContentProps}>
        <ModalHeader {...modalHeaderProps} className="flex items-center gap-2">
          <p>Not Found Collection</p> <GiCardPickup size={18} />
        </ModalHeader>
        <ModalBody {...modalBodyProps}>
          <p>
            You may be currently trying to view the collection that does not
            exist on your current chain! You will be redirect to the Collection
            Table!
          </p>
        </ModalBody>
        <ModalFooter {...modalFooterProps}>
          <Button onClick={onConfirm}>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

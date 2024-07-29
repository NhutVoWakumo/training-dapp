import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";

import { GiCardPickup } from "react-icons/gi";
import React from "react";

interface RedirectToTableModalProps extends Omit<ModalProps, "children"> {
  onConfirm: () => void;
}

export const RedirectToTableModal = ({
  onConfirm,
  className,
  ...props
}: RedirectToTableModalProps) => {
  return (
    <Modal backdrop="blur" className={`${className} z-50`} {...props}>
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <p>Not Found Collection</p> <GiCardPickup size={18} />
        </ModalHeader>
        <ModalBody>
          <p>
            You may be currently trying to view the collection that does not
            exist on your current chain! You will be redirect to the Collection
            Table!
          </p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onConfirm}>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

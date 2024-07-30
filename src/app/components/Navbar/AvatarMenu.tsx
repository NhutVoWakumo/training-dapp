import {
  Avatar,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useCallback } from "react";
import { useSignAndVerifyMessage, useWalletProvider } from "@/app/hooks";

import { formatAddress } from "@/app/utils";
import { messageToSign } from "@/app/constants";
import toast from "react-hot-toast";

export const AvatarMenu = () => {
  const {
    selectedAccount,
    disconnectWallet,
    globalLoading,
    processErrorMessage,
  } = useWalletProvider();
  const { signMessage, verifyMessage } = useSignAndVerifyMessage();

  const verifyAccount = useCallback(async () => {
    try {
      const signedData = await signMessage(messageToSign);

      if (!signedData) return toast.error("An error occur while sign message");

      const { signature, address: signerAddress } = signedData;

      const publicAddress = verifyMessage(messageToSign, signature);

      if (publicAddress === signerAddress) return toast.success("Verified");

      return toast.error("Unable to verify");
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
    }
  }, [processErrorMessage, signMessage, verifyMessage]);

  if (!selectedAccount) return <></>;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name="Jason Hughes"
          size="sm"
          src={`https://api.multiavatar.com/${selectedAccount}.png`}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        disabledKeys={["address"]}
      >
        <DropdownItem key="address" className="h-14 gap-2">
          <p className="font-semibold">Connected with</p>
          <p className="font-semibold">{formatAddress(selectedAccount)}</p>
        </DropdownItem>
        <DropdownItem key="divider">
          <Divider />
        </DropdownItem>
        <DropdownItem
          key="verify-account"
          onClick={verifyAccount}
          isReadOnly={globalLoading}
        >
          Verify Account
        </DropdownItem>
        <DropdownItem
          key="copy-address"
          onClick={() => {
            navigator.clipboard.writeText(selectedAccount);
            toast.success("Copied to clipboard");
          }}
        >
          Copy Address
        </DropdownItem>
        <DropdownItem
          key="disconnect"
          color="danger"
          className="text-red-500"
          onClick={disconnectWallet}
        >
          Disconnect
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

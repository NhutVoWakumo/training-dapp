import {
  Avatar,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useCallback, useMemo } from "react";
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

  const avatarDropdownItems: DropdownItemProps[] = useMemo(
    () => [
      {
        key: "address",
        className: "h-14 gap-2",
        children: (
          <>
            <p className="font-semibold">Connected with</p>
            <p className="font-semibold">
              {formatAddress(selectedAccount as string)}
            </p>
          </>
        ),
      },
      {
        key: "divider",
        children: <Divider />,
      },
      {
        key: "verify-account",
        onClick: verifyAccount,
        isReadOnly: globalLoading,
        children: "Verify Account",
      },
      {
        key: "copy-address",
        onClick: () => {
          navigator.clipboard.writeText(selectedAccount as string);
          toast.success("Copied to clipboard");
        },
        children: "Copy Address",
      },
      {
        key: "disconnect",
        color: "danger",
        className: "text-red-500",
        onClick: disconnectWallet,
        children: "Disconnect",
      },
    ],
    [selectedAccount, disconnectWallet, globalLoading, verifyAccount],
  );

  if (!selectedAccount) return <></>;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          size="sm"
          src={`https://api.multiavatar.com/${selectedAccount.toLocaleLowerCase()}.png`}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        disabledKeys={["address"]}
      >
        {avatarDropdownItems.map((item) => (
          <DropdownItem {...item} key={item.key}>
            {item.children}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

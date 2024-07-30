import {
  Avatar,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

import React from "react";
import { formatAddress } from "@/app/utils";
import toast from "react-hot-toast";
import { useWalletProvider } from "@/app/hooks";

export const AvatarMenu = () => {
  const { selectedAccount, disconnectWallet } = useWalletProvider();

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

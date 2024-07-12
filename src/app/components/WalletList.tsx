"use client";

import { Button, Divider, Flex, Image, Space, Spin, Typography } from "antd";

import { WalletConnectButton } from "./WalletConnectButton";
import { useWalletProvider } from "../hooks";

export const WalletList = () => {
  const { selectedWallet } = useWalletProvider();

  return (
    <Flex align="center" justify="center" style={{ height: "90vh" }}>
      {!selectedWallet && <WalletConnectButton />}
    </Flex>
  );
};

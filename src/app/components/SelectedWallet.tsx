"use client";

import { Avatar, Button, Card, Flex, Image, Space } from "antd";
import { useCallback, useEffect, useState } from "react";

import { IChainData } from "../interfaces";
import { chainData } from "../constants";
import { formatAddress } from "../utils";
import { useWalletProvider } from "../hooks";

const { Meta } = Card;

export const SelectedWallet = () => {
  const [accountBalance, setAccountBalance] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentChain, setCurrentChain] = useState<IChainData>();

  const {
    selectedWallet,
    selectedAccount,
    disconnectWallet,
    chainId,
    currentBalance,
  } = useWalletProvider();

  useEffect(() => {
    const chain = chainData.find(
      (item) => BigInt(item.chainId) === BigInt(chainId)
    );

    setAccountBalance(currentBalance);
    setCurrentChain(chain);
  }, [chainId, currentBalance, selectedAccount]);

  return (
    <Flex vertical justify="center" align="center" gap={16}>
      {selectedAccount && (
        <Card
          extra={
            <Button type="text" danger onClick={disconnectWallet}>
              Disconnect
            </Button>
          }
          title={<div>{selectedWallet?.info.name}</div>}
          loading={loading}
          style={{ minWidth: "300px" }}
        >
          <Meta
            title={formatAddress(selectedAccount)}
            description={
              <Space>
                <Avatar>{currentChain?.nativeCurrency?.symbol ?? "?"}</Avatar>
                <div>{`${accountBalance} ${currentChain?.nativeCurrency.name}`}</div>
              </Space>
            }
          />
        </Card>
      )}
    </Flex>
  );
};

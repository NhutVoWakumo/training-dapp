"use client";

import { Avatar, Button, Card, Flex, Image, Space } from "antd";
import { useWalletProvider } from "../hooks";
import { formatAddress } from "../utils";
import { useCallback, useEffect, useState } from "react";
import { chainData } from "../constants";
import { IChainData } from "../interfaces";

const { Meta } = Card;

export const SelectedWallet = () => {
  const [accountBalance, setAccountBalance] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentChain, setCurrentChain] = useState<IChainData>();

  const {
    selectedWallet,
    selectedAccount,
    disconnectWallet,
    getAccountBalance,
  } = useWalletProvider();
  const getBalanceData = useCallback(async () => {
    setLoading(true);
    try {
      if (!selectedWallet?.provider) return;
      const balance = await getAccountBalance(
        selectedWallet?.provider,
        selectedAccount as string
      );

      const chainId = (await selectedWallet?.provider.request({
        method: "eth_chainId",
      })) as string;

      const chain = chainData.find(
        (item) => BigInt(item.chainId) === BigInt(chainId)
      );

      setAccountBalance(balance);
      setCurrentChain(chain);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getAccountBalance, selectedAccount, selectedWallet?.provider]);

  useEffect(() => {
    getBalanceData();
  }, [getBalanceData, selectedAccount, selectedWallet?.provider]);

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
          style={{ width: "500px" }}
          loading={loading}
        >
          <Meta
            avatar={
              <Image
                src={selectedWallet?.info.icon}
                alt={selectedWallet?.info.name}
                preview={false}
              />
            }
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
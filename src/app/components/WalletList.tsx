"use client";

import { Button, Divider, Flex, Image, Space, Spin, Typography } from "antd";

import { WalletConnectButton } from "./WalletConnectButton";
import { useWalletProvider } from "../hooks";

export const WalletList = () => {
  const { wallets, connectWallet, selectedWallet } = useWalletProvider();

  return (
    <Flex align="center" justify="center" style={{ height: "90vh" }}>
      {!selectedWallet && (
        <Flex vertical gap={16} justify="center" align="center">
          <h2>Wallets Detected:</h2>
          <Flex vertical gap={10}>
            {Object.keys(wallets).length > 0 ? (
              Object.values(wallets).map((provider: EIP6963ProviderDetail) => (
                <Button
                  key={provider.info.uuid}
                  onClick={() => connectWallet(provider.info.rdns)}
                  icon={
                    <Image
                      src={provider.info.icon}
                      alt={provider.info.name}
                      preview={false}
                      style={{ maxWidth: "2rem" }}
                    />
                  }
                  size="large"
                  shape="round"
                >
                  {provider.info.name}
                </Button>
              ))
            ) : (
              <Space>
                <Spin spinning />
                <Typography.Text>
                  Currently there are no any providers
                </Typography.Text>
              </Space>
            )}
          </Flex>
          <Divider>Or</Divider>
          <WalletConnectButton />
        </Flex>
      )}
    </Flex>
  );
};

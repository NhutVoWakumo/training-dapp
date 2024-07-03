"use client";

import { useWalletProvider } from "../hooks";
import { Button, Flex, Image, Space, Spin, Typography } from "antd";

export const WalletList = () => {
  const { wallets, connectWallet, selectedWallet } = useWalletProvider();

  return (
    <>
      {!selectedWallet && (
        <Flex vertical gap={16} justify="center" align="center">
          <h2>Wallets Detected:</h2>
          <Flex vertical>
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
                    />
                  }
                  size="large"
                  type="primary"
                >
                  <Typography.Text style={{ color: "white" }}>
                    {provider.info.name}
                  </Typography.Text>
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
        </Flex>
      )}
    </>
  );
};

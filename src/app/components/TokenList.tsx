"use client";

import { Avatar, Button, List } from "antd";
import { ERC20ABI, sepoliaChainId, sepoliaERC20Tokens } from "../constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ethers, formatUnits, getAddress } from "ethers";

import { formatAddress } from "../utils";
import { useWalletProvider } from "../hooks";

interface ITokenData {
  symbol: string;
  balance: string;
  decimals: string;
  address: string;
  contract: ethers.Contract;
}

export const TokenList = () => {
  const { selectedWallet, chainId, selectedAccount } = useWalletProvider();
  const [tokenList, setTokenList] = useState<ITokenData[]>([]);

  const infuraProvider = useMemo(() => {
    return new ethers.InfuraProvider(
      "sepolia",
      //   process.env.ETHERSCAN_API_KEY
      //   process.env.INFURA_API_KEY
      "0b9ea30f1f06497ca69e4af6522d9c8d"
    );
  }, []);

  const defaultProvider = ethers.getDefaultProvider("sepolia");

  const ethersScript = useCallback(
    async (
      erc20: ethers.Contract,
      accountAddress: string,
      tokenAddress: string
    ) => {
      try {
        const balanceOf = await erc20.balanceOf(accountAddress);
        const symbol = await erc20.symbol();
        const decimals = await erc20.decimals();

        console.log(
          `The Balance of ${selectedAccount} is: ${formatUnits(
            balanceOf,
            decimals
          )} ${symbol} (decimals: ${decimals}, value: ${balanceOf})`
        );

        setTokenList((prevList) => [
          ...prevList,
          {
            balance: formatUnits(balanceOf, decimals),
            symbol: symbol as string,
            address: tokenAddress as string,
            decimals: Number(decimals).toString(),
            contract: erc20,
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    },
    [selectedAccount]
  );

  const addTokenToWallet = useCallback(async (token: ITokenData) => {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!selectedAccount) return;
    setTokenList([]);
    sepoliaERC20Tokens.forEach((item) => {
      const tokenAddress = getAddress(item.address);
      const accountAddress = getAddress(selectedAccount);
      const erc20 = new ethers.Contract(tokenAddress, ERC20ABI, infuraProvider);

      ethersScript(erc20, accountAddress, tokenAddress);
    });
  }, [ethersScript, infuraProvider, selectedAccount]);

  return (
    <>
      {chainId.toString() === sepoliaChainId && selectedAccount && (
        <div>
          <List
            dataSource={tokenList}
            itemLayout="vertical"
            renderItem={(item) => (
              <List.Item
                style={{ width: "100%" }}
                actions={[
                  <Button
                    key={"add-token"}
                    onClick={() => addTokenToWallet(item)}
                  >
                    Add token to wallet
                  </Button>,
                  <Button
                    key={"transfer-token"}
                    // onClick={() => transferToken(item)}
                  >
                    Transfer
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar>{item.symbol}</Avatar>}
                  title={formatAddress(item.address)}
                  description={`Balance: ${item.balance}`}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </>
  );
};

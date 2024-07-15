"use client";

import { Avatar, Button, List, Spin, message } from "antd";
import { ERC20ABI, sepoliaChainId, sepoliaERC20Tokens } from "../constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ethers, formatUnits, getAddress, parseUnits } from "ethers";

import { ITokenData } from "../interfaces";
import { TransactionResponse } from "ethers";
import { TransferModal } from "./TransferModal";
import { formatAddress } from "../utils";
import { useForm } from "antd/es/form/Form";
import { useWalletProvider } from "../hooks";

export const TokenList = () => {
  const [form] = useForm();
  const [tokenList, setTokenList] = useState<ITokenData[]>([]);
  const [currentToken, setCurrentToken] = useState<ITokenData>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const {
    selectedWallet,
    chainId,
    selectedAccount,
    triggerLoading,
    processErrorMessage,
    globalLoading,
    currentProvider,
    getAccountBalance,
  } = useWalletProvider();

  const infuraProvider = useMemo(() => {
    return new ethers.InfuraProvider(
      "sepolia",
      process.env.NEXT_PUBLIC_INFURA_API_KEY
    );
  }, []);

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
        processErrorMessage(error);
      }
    },
    [processErrorMessage]
  );

  const refetchBalance = useCallback(
    async (token: ITokenData) => {
      let currentTokenList = tokenList;
      const currentUpdatedIndex = tokenList.findIndex(
        (item) => item.address === token.address
      );
      try {
        const newTokenBalance = await token.contract.balanceOf(selectedAccount);

        currentTokenList[currentUpdatedIndex].balance = formatUnits(
          newTokenBalance,
          BigInt(token.decimals)
        );

        setTokenList(currentTokenList);

        await getAccountBalance(selectedAccount as string);
      } catch (error) {
        console.error(error);
        processErrorMessage(error);
      }
    },
    [getAccountBalance, processErrorMessage, selectedAccount, tokenList]
  );

  const addTokenToWallet = useCallback(
    async (token: ITokenData) => {
      triggerLoading(true);
      try {
        await selectedWallet?.provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
            },
          } as any,
        });
      } catch (error) {
        console.log(error);
        processErrorMessage(error);
      } finally {
        triggerLoading(false);
      }
    },
    [processErrorMessage, selectedWallet?.provider, triggerLoading]
  );

  const transferToken = useCallback(
    async (token?: ITokenData) => {
      if (!token) return;

      triggerLoading(true);
      try {
        const values = await form?.validateFields();
        setOpenModal(false);
        const { address, value } = values;
        const signer = await currentProvider?.getSigner();
        const contract = new ethers.Contract(token.address, ERC20ABI, signer);
        const transactionResponse = (await contract.transfer(
          address,
          parseUnits(value, Number(token.decimals))
        )) as TransactionResponse;
        console.log(transactionResponse);
        const provider = new ethers.EtherscanProvider(
          "sepolia",
          process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
        );
        const receipt = await provider.waitForTransaction(
          transactionResponse.hash
        );
        console.log(receipt);
        message.success("Transaction completed");
        await refetchBalance(token);
      } catch (error) {
        processErrorMessage(error);
      } finally {
        triggerLoading(false);
      }
    },
    [currentProvider, form, processErrorMessage, refetchBalance, triggerLoading]
  );

  const onOk = useCallback(async () => {
    try {
      await form?.validateFields();
      await transferToken(currentToken);
    } catch (error) {
      console.error(error);
    }
  }, [currentToken, form, transferToken]);

  useEffect(() => {
    if (!selectedAccount) return;

    setTokenList([]);
    setLocalLoading(true);
    sepoliaERC20Tokens.forEach((item) => {
      const tokenAddress = getAddress(item.address);
      const accountAddress = getAddress(selectedAccount);
      const erc20 = new ethers.Contract(tokenAddress, ERC20ABI, infuraProvider);

      ethersScript(erc20, accountAddress, tokenAddress);
    });
    setLocalLoading(false);
  }, [ethersScript, infuraProvider, selectedAccount]);

  return (
    <>
      {chainId.toString() === sepoliaChainId && selectedAccount && (
        <div>
          <List
            dataSource={tokenList}
            itemLayout="vertical"
            loading={localLoading}
            renderItem={(item) => (
              <Spin spinning={localLoading}>
                <List.Item
                  actions={[
                    <Button
                      key={"add-token"}
                      onClick={() => addTokenToWallet(item)}
                      disabled={globalLoading}
                    >
                      Import {item.symbol}
                    </Button>,
                    <Button
                      key={"transfer-token"}
                      onClick={() => {
                        setCurrentToken(item);
                        setOpenModal(true);
                      }}
                      disabled={globalLoading}
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
              </Spin>
            )}
          />
          <TransferModal
            open={openModal}
            onCancel={() => setOpenModal(false)}
            onOk={onOk}
            globalLoading={globalLoading}
            form={form}
            currentBalance={
              tokenList.find((item) => item.address === currentToken?.address)
                ?.balance
            }
          />
        </div>
      )}
    </>
  );
};

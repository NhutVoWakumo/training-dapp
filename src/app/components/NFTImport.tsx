"use client";

import { Button, Flex, Space, message } from "antd";
import { Contract, getAddress } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { ERC721ABI } from "../constants";
import { EtherscanProvider } from "ethers";
import { NFTData } from "../interfaces";
import { NFTImportModal } from "./NFTImportModal";
import axios from "axios";
import { createNFTUrl } from "../utils";
import { useForm } from "antd/es/form/Form";
import { useWalletProvider } from "../hooks";

interface NFTImportProps {
  onSave?: (data: NFTData) => void;
}

export const NFTImport = ({ onSave }: NFTImportProps) => {
  const [form] = useForm();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const {
    selectedAccount,
    processErrorMessage,
    triggerLoading,
    globalLoading,
  } = useWalletProvider();

  const etherscanProvider = useMemo(() => {
    return new EtherscanProvider(
      "sepolia",
      process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    );
  }, []);

  const getNFT = useCallback(async () => {
    triggerLoading(true);
    try {
      const values = await form.validateFields();
      const { address, tokenId } = values;

      const contract = new Contract(
        getAddress(address),
        ERC721ABI,
        etherscanProvider
      );

      const ownerOf = await contract.ownerOf(tokenId);

      if (ownerOf !== selectedAccount) {
        setOpenModal(false);
        return processErrorMessage({
          message: "You are not the owner of this NFT",
        });
      }

      const tokenUri = await contract.tokenURI(tokenId);

      const { data: nftData } = await axios.get(createNFTUrl(tokenUri));

      onSave?.({
        address: address,
        tokenId: tokenId,
        contract,
        ...nftData,
      });

      form.resetFields();
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
    } finally {
      triggerLoading(false);
      setOpenModal(false);
    }
  }, [
    etherscanProvider,
    form,
    onSave,
    processErrorMessage,
    selectedAccount,
    triggerLoading,
  ]);

  const onOk = useCallback(async () => {
    try {
      await form?.validateFields();
      getNFT();
    } catch (error) {
      console.error(error);
    }
  }, [form, getNFT]);

  return (
    <Flex vertical style={{ width: "100%" }} align="center" justify="center">
      <Button
        onClick={() => setOpenModal(true)}
        style={{ width: "100%", maxWidth: "300px" }}
      >
        Import NFT
      </Button>
      <NFTImportModal
        globalLoading={globalLoading}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        form={form}
        onOk={onOk}
      />
    </Flex>
  );
};

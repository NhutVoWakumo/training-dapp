"use client";

import {
  Avatar,
  Button,
  Image,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { BiPackage, BiSolidWallet } from "react-icons/bi";
import { Contract, TransactionResponse, isAddress } from "ethers";
import { ERC1155ABI, ERC721ABI } from "@/app/abis";
import { IChainData, OpenseaNFTWithoutTrait } from "@/app/interfaces";
import React, { useCallback, useState } from "react";

import { Form } from "antd";
import { TOKEN_STANDARDS } from "@/app/constants";
import toast from "react-hot-toast";
import { useForm } from "antd/es/form/Form";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useOwnedNFTList } from "../hooks/useOwnedNFTList";
import { useWalletProvider } from "@/app/hooks";

interface TransferNFTProps {
  accountAddress: string;
  slug: string;
  chainData?: IChainData;
  nftImageFallback: string;
}

export const TransferNFT = ({
  accountAddress,
  nftImageFallback,
  slug,
  chainData,
}: TransferNFTProps) => {
  const [form] = useForm();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedNFT, setSelectedNFT] = useState<OpenseaNFTWithoutTrait>();
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const { canLoadMore, isLoading, nftList, onLoadMore, resetList } =
    useOwnedNFTList({
      collectionSlug: slug,
      currentChainData: chainData as IChainData,
      accountAddress,
    });

  const { infuraProvider, currentProvider, processErrorMessage } =
    useWalletProvider();

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: canLoadMore,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore,
  });

  const handleTranferNFT = useCallback(async () => {
    if (
      !currentProvider ||
      !selectedNFT?.contract ||
      !selectedNFT.token_standard
    )
      return;

    setLocalLoading(true);
    try {
      const { to, tokenId, amount } = await form.validateFields();
      const isTokenERC1155 =
        selectedNFT?.token_standard === TOKEN_STANDARDS.ERC1155;
      const abi = isTokenERC1155 ? ERC1155ABI : ERC721ABI;

      const signer = await currentProvider.getSigner();
      const contract = new Contract(selectedNFT?.contract, abi, signer);

      let transactionResponse;

      if (isTokenERC1155) {
        transactionResponse = (await contract?.safeTransferFrom(
          accountAddress,
          to,
          tokenId,
          amount,
        )) as TransactionResponse;
      } else {
        transactionResponse = (await contract?.safeTransferFrom(
          accountAddress,
          to,
          tokenId,
        )) as TransactionResponse;
      }

      const receipt = await infuraProvider?.waitForTransaction(
        transactionResponse.hash,
      );

      console.log(receipt);
      toast.success("Transaction completed");
    } catch (error) {
      console.error(error);
      processErrorMessage(error);
    } finally {
      setLocalLoading(false);
      resetList();
      onLoadMore();
      setSelectedNFT(undefined);
      form?.resetFields();
    }
  }, [
    accountAddress,
    currentProvider,
    form,
    infuraProvider,
    onLoadMore,
    processErrorMessage,
    resetList,
    selectedNFT,
  ]);

  return (
    <div>
      <p className="mb-5 text-lg">Transfer your NFT easily</p>
      <Form form={form}>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <div className="flex w-full flex-col gap-2 md:w-4/5">
            <Form.Item
              name={"to"}
              rules={[
                {
                  required: true,
                  message: "Please input an address",
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();

                    if (!isAddress(value))
                      return Promise.reject(new Error("Invalid address"));

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                label="To"
                placeholder="Please input receiver's address"
                endContent={<BiSolidWallet size={20} />}
              />
            </Form.Item>
            <Form.Item
              name={"tokenId"}
              rules={[
                {
                  required: true,
                  message: "Please choose one NFT to transfer",
                },
              ]}
            >
              <Select
                fullWidth
                isLoading={isLoading}
                items={nftList}
                label="Pick a NFT"
                placeholder="Select a NFT"
                scrollRef={scrollerRef}
                selectionMode="single"
                onOpenChange={setIsOpen}
                disabled={!nftList.length}
                onSelectionChange={(key) => {
                  const isEmptySelect = !new Set(key).size;
                  if (isEmptySelect) {
                    form.resetFields(["tokenId"]);
                    setSelectedNFT(undefined);
                  } else {
                    form.setFieldValue("tokenId", key["currentKey"]);
                  }
                }}
              >
                {(item) => (
                  <SelectItem
                    onPress={() => setSelectedNFT(item)}
                    key={item.identifier}
                    textValue={
                      item.name ?? `${item.collection} #${item.identifier}`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={item.display_image_url}
                        showFallback
                        fallback={
                          <Image
                            src={nftImageFallback}
                            alt="fallback"
                            className="size-full"
                          />
                        }
                        radius="sm"
                        size="lg"
                      />
                      <div className="text-small">
                        {item.name ?? `${item.collection} #${item.identifier}`}
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </Form.Item>
            {selectedNFT?.token_standard?.toUpperCase() ===
              TOKEN_STANDARDS.ERC1155 && (
              <Form.Item
                name={"amount"}
                rules={[
                  {
                    required: true,
                    message: "Please input amount",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Please input a valid number",
                  },
                  {
                    validator: async (_, value) => {
                      const contract = new Contract(
                        selectedNFT.contract,
                        ERC1155ABI,
                        infuraProvider,
                      );
                      const balance = await contract.balanceOf(
                        accountAddress,
                        selectedNFT.identifier,
                      );

                      if (!balance) return Promise.resolve();

                      if (!value || value <= balance) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(`Value cannot exceed ${balance}`),
                      );
                    },
                  },
                ]}
              >
                <Input
                  label="Amount"
                  placeholder="Please input receiver's address"
                  endContent={<BiPackage size={20} />}
                />
              </Form.Item>
            )}
          </div>
          {selectedNFT?.display_image_url ? (
            <Image
              src={selectedNFT.display_image_url}
              alt="nft image"
              className="hidden object-contain md:block md:h-36"
              removeWrapper
            />
          ) : (
            <Image
              src={nftImageFallback}
              alt="nft image"
              className={`object-contain blur-sm ${selectedNFT ? "hidden md:block md:h-36" : "hidden"}`}
              removeWrapper
            />
          )}
        </div>
        <Form.Item>
          <Button
            onClick={handleTranferNFT}
            isLoading={localLoading}
            className="bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 text-white shadow-lg"
          >
            Transfer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

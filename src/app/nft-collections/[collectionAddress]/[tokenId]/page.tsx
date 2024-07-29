"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import { IChainData, OpenseaCollection, OpenseaNFT } from "@/app/interfaces";
import React, { useCallback, useEffect, useState } from "react";
import {
  getChainData,
  getOpenseaCollectionContract,
  getOpenseaCollectionMetaData,
  getOpenseaNFTData,
} from "../utils";
import { useParams, useRouter } from "next/navigation";

import { BiAnalyse } from "react-icons/bi";
import { EmptyPage } from "@/app/components";
import { NFTData } from "./components/NFTData";
import { NFTEventTable } from "./components/NFTEventTable";
import { NFTImage } from "./components";
import { RedirectToTableModal } from "../../components";
import { getStringParam } from "@/app/utils";
import { useWalletProvider } from "@/app/hooks";

const NFTDetail = () => {
  const params = useParams();
  const { tokenId, collectionAddress } = params;
  const { chainId } = useWalletProvider();
  const router = useRouter();

  const [currentOpenseaChain, setCurrentOpenseaChain] = useState<IChainData>();
  const [currentNFTData, setCurrentNFTData] = useState<OpenseaNFT>();
  const [loading, setLoading] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<OpenseaCollection>();
  const [isNotCorrectChainId, setIsNotCorrectChainId] =
    useState<boolean>(false);

  const getCollectionSlug = useCallback(async () => {
    if (!currentOpenseaChain) return;
    try {
      const { data } = await getOpenseaCollectionContract(
        currentOpenseaChain,
        getStringParam(collectionAddress),
      );
      const slug = data.collection;

      if (!slug) return "";

      return slug;
    } catch (error) {
      console.error(error);
      setIsNotCorrectChainId(true);
    }
  }, [collectionAddress, currentOpenseaChain]);

  const getCollectionMetaData = useCallback(async () => {
    if (!currentOpenseaChain) return;

    setLoading(true);

    try {
      const slug = await getCollectionSlug();
      if (!slug) {
        setIsNotCorrectChainId(true);
        return;
      }

      const { data } = await getOpenseaCollectionMetaData(
        currentOpenseaChain,
        slug,
      );

      setCollectionData(data);
    } catch (error) {
      console.error(error);
      setIsNotCorrectChainId(true);
    } finally {
      setLoading(false);
    }
  }, [currentOpenseaChain, getCollectionSlug]);

  const getNFTMetaData = useCallback(async () => {
    if (!currentOpenseaChain) return;

    try {
      const { data } = await getOpenseaNFTData(
        getStringParam(collectionAddress),
        currentOpenseaChain,
        getStringParam(tokenId),
      );

      setCurrentNFTData(data);
    } catch (error) {
      console.error(error);
    }
  }, [collectionAddress, currentOpenseaChain, tokenId]);

  useEffect(() => {
    if (!chainId) return;

    const currentChainData = getChainData(chainId);

    if (currentChainData) setCurrentOpenseaChain(currentChainData);
  }, [chainId]);

  useEffect(() => {
    getNFTMetaData();
  }, [getNFTMetaData]);

  useEffect(() => {
    getCollectionMetaData();
  }, [getCollectionMetaData]);

  if (loading) return <EmptyPage />;

  return (
    <>
      {currentNFTData && collectionData ? (
        <div className="flex flex-col gap-10 p-3 md:p-10">
          <div className="flex w-full flex-col gap-5 lg:flex-row">
            <div className="w-full lg:w-[40vw]">
              <NFTImage
                chainData={currentOpenseaChain as IChainData}
                imgSrc={currentNFTData?.nft.display_image_url}
                fallbackSrc={collectionData.image_url}
              />
            </div>
            <div className="w-full">
              <NFTData
                collectionAddress={collectionAddress as string}
                collectionData={collectionData}
                nftData={currentNFTData.nft}
                chainData={currentOpenseaChain as IChainData}
              />
            </div>
          </div>
          <Accordion variant="light" defaultExpandedKeys={"all"}>
            <AccordionItem
              key={"NFT event table"}
              title={<div className="font-semibold">Item Activity</div>}
              startContent={<BiAnalyse size={22} />}
            >
              <NFTEventTable
                chainData={currentOpenseaChain as IChainData}
                collectionAddress={collectionAddress as string}
                tokenId={currentNFTData.nft.identifier}
              />
            </AccordionItem>
          </Accordion>
        </div>
      ) : (
        <RedirectToTableModal
          isOpen={!collectionData}
          onConfirm={() => router.push("/nft-collections")}
        />
      )}
    </>
  );
};

export default NFTDetail;

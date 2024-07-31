"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import { IChainData, OpenseaCollection, OpenseaNFT } from "@/app/interfaces";
import { NFTData, NFTEventTable, NFTImage } from "./components";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { BiAnalyse } from "react-icons/bi";
import { EmptyPage } from "@/app/components";
import { RedirectToTableModal } from "../../components";
import { getOpenseaNFTData } from "../utils";
import { getStringParam } from "@/app/utils";
import { useGetCollectionData } from "../../hooks";
import { useWalletProvider } from "@/app/hooks";

interface NFTDetailParams {
  tokenId: string;
  collectionAddress: string;
}
export interface NFTDetailProps {
  params: NFTDetailParams;
}

const NFTDetail = () => {
  const params = useParams();
  const { tokenId, collectionAddress } = params;
  const { processErrorMessage } = useWalletProvider();
  const router = useRouter();
  const { collectionData, currentOpenseaChain, isNotCorrectChainId, loading } =
    useGetCollectionData({
      collectionAddress: getStringParam(collectionAddress),
    });

  const [currentNFTData, setCurrentNFTData] = useState<OpenseaNFT>();

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
      processErrorMessage(error);
    }
  }, [collectionAddress, currentOpenseaChain, processErrorMessage, tokenId]);

  useEffect(() => {
    getNFTMetaData();
  }, [getNFTMetaData]);

  if (loading) return <EmptyPage />;

  if (isNotCorrectChainId || !currentNFTData)
    return (
      <RedirectToTableModal
        isOpen={isNotCorrectChainId}
        onConfirm={() => router.push("/nft-collections")}
      />
    );

  return (
    <div className="flex max-w-[100vw] flex-col gap-10 overflow-x-hidden p-3 md:p-10">
      <div className="flex w-full flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-[40vw]">
          <NFTImage
            chainData={currentOpenseaChain as IChainData}
            imgSrc={currentNFTData?.nft.display_image_url}
            fallbackSrc={collectionData?.image_url ?? ""}
          />
        </div>
        <div className="w-full lg:w-[50vw]">
          <NFTData
            collectionAddress={collectionAddress as string}
            collectionData={collectionData as OpenseaCollection}
            nftData={currentNFTData?.nft}
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
            tokenId={currentNFTData?.nft.identifier}
          />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default NFTDetail;

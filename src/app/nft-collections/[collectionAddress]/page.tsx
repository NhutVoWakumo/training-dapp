"use client";

import { CollectionContent, CollectionHeader } from "./components";
import { IChainData, OpenseaCollection } from "@/app/interfaces";
import React, { useCallback, useEffect, useState } from "react";
import {
  getChainData,
  getOpenseaCollectionContract,
  getOpenseaCollectionMetaData,
} from "./utils";

import { EmptyPage } from "@/app/components";
import { RedirectToTableModal } from "../components";
import { useRouter } from "next/navigation";
import { useWalletProvider } from "@/app/hooks";

const CollectionDetail = ({
  params,
}: {
  params: { collectionAddress: string };
}) => {
  const { collectionAddress: address } = params;
  const { chainId } = useWalletProvider();
  const router = useRouter();

  const [currentOpenseaChain, setCurrentOpenseaChain] = useState<IChainData>();
  const [collectionData, setCollectionData] = useState<OpenseaCollection>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSlug, setCurrentSlug] = useState<string>("");
  const [isNotCorrectChainId, setIsNotCorrectChainId] =
    useState<boolean>(false);

  const getCollectionSlug = useCallback(async () => {
    if (!currentOpenseaChain) return;
    try {
      const { data } = await getOpenseaCollectionContract(
        currentOpenseaChain,
        address,
      );

      if (!data) {
        setIsNotCorrectChainId(true);
        return;
      }

      const slug = data.collection;

      if (!slug) return "";

      setCurrentSlug(slug);

      return slug;
    } catch (error) {
      console.error(error);
      setIsNotCorrectChainId(true);
    }
  }, [address, currentOpenseaChain]);

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

  useEffect(() => {
    if (!chainId) return;

    const currentChainData = getChainData(chainId);

    if (currentChainData) setCurrentOpenseaChain(currentChainData);
  }, [chainId]);

  useEffect(() => {
    getCollectionMetaData();
  }, [getCollectionMetaData]);

  console.log(isNotCorrectChainId);

  return (
    <div>
      {loading ? (
        <EmptyPage />
      ) : (
        <>
          {isNotCorrectChainId || !collectionData ? (
            <RedirectToTableModal
              isOpen={isNotCorrectChainId}
              onConfirm={() => router.push("/nft-collections")}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <CollectionHeader
                address={address}
                collectionData={collectionData}
                isLoading={loading}
              />
              <CollectionContent
                address={address}
                collectionData={collectionData}
                slug={currentSlug}
                chainData={currentOpenseaChain}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CollectionDetail;

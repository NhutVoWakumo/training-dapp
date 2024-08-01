"use client";

import { IChainData, OpenseaCollection } from "@/app/interfaces";
import {
  getChainData,
  getOpenseaCollectionContract,
  getOpenseaCollectionMetaData,
} from "../[collectionAddress]/utils";
import { useCallback, useEffect, useState } from "react";

import { getStringParam } from "@/app/utils";
import { useWalletProvider } from "@/app/hooks";

interface UseGetCollectionDataProps {
  collectionAddress: string;
}

export const useGetCollectionData = ({
  collectionAddress,
}: UseGetCollectionDataProps) => {
  const [currentOpenseaChain, setCurrentOpenseaChain] = useState<IChainData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<OpenseaCollection>();
  const [isNotCorrectChainId, setIsNotCorrectChainId] =
    useState<boolean>(false);
  const [currentSlug, setCurrentSlug] = useState<string>("");
  const { chainId, processErrorMessage } = useWalletProvider();

  const getCollectionSlug = useCallback(async () => {
    if (!currentOpenseaChain) return;
    try {
      const { data } = await getOpenseaCollectionContract(
        currentOpenseaChain,
        getStringParam(collectionAddress),
      );
      const slug = data.collection;

      if (!slug) return "";

      setCurrentSlug(slug);

      return slug;
    } catch (error) {
      console.error(error);
      setIsNotCorrectChainId(true);
      processErrorMessage(error);
    }
  }, [collectionAddress, currentOpenseaChain, processErrorMessage]);

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
      processErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [currentOpenseaChain, getCollectionSlug, processErrorMessage]);

  useEffect(() => {
    if (!chainId) return;

    const currentChainData = getChainData(chainId);

    if (currentChainData) setCurrentOpenseaChain(currentChainData);
  }, [chainId]);

  useEffect(() => {
    getCollectionMetaData();
  }, [getCollectionMetaData]);

  return {
    loading,
    currentOpenseaChain,
    isNotCorrectChainId,
    collectionData,
    currentSlug,
  };
};

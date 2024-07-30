import {
  IChainData,
  OpenseaCollection,
  OpenseaCollectionContract,
  OpenseaNFTListResponse,
} from "@/app/interfaces";

import axios from "axios";

export const getOpenseaCollectionContract = async (
  chain: IChainData,
  address: string,
) => {
  return axios.get<OpenseaCollectionContract>(
    `${chain.openseaUrl}/api/v2/chain/${chain.openseaName}/contract/${address}`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY,
      },
    },
  );
};

export const getOpenseaCollectionMetaData = async (
  chain: IChainData,
  slug: string,
) => {
  return axios.get<OpenseaCollection>(
    `${chain.openseaUrl}/api/v2/collections/${slug}`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY,
      },
    },
  );
};

export const getOpenseaNFTsByAccount = async (
  address: string,
  chain: IChainData,
  collectionSlug: string,
  next?: string,
) => {
  return axios.get<OpenseaNFTListResponse>(
    `${chain.openseaUrl}/api/v2/chain/${chain.openseaName}/account/${address}/nfts`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY,
      },
      params: {
        collection: collectionSlug,
        next,
      },
    },
  );
};

export const getOpenseaNFTsByContract = async (
  address: string,
  chain: IChainData,
  next?: string,
) => {
  return axios.get<OpenseaNFTListResponse>(
    `${chain.openseaUrl}/api/v2/chain/${chain.openseaName}/contract/${address}/nfts`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY,
      },
      params: {
        next,
      },
    },
  );
};

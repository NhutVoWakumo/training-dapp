"use client";

import { CollectionContent, CollectionHeader } from "./components";

import { EmptyPage } from "@/app/components";
import React from "react";
import { RedirectToTableModal } from "../components";
import { useGetCollectionData } from "../hooks";
import { useRouter } from "next/navigation";

export interface CollectionDetailProps {
  params: CollectionDetailParams;
}

interface CollectionDetailParams {
  collectionAddress: string;
}

const CollectionDetail = ({ params }: CollectionDetailProps) => {
  const { collectionAddress: address } = params;
  const router = useRouter();

  const {
    currentSlug,
    collectionData,
    currentOpenseaChain,
    isNotCorrectChainId,
    loading,
  } = useGetCollectionData({ collectionAddress: address });

  if (loading) return <EmptyPage />;

  return (
    <div>
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
    </div>
  );
};

export default CollectionDetail;

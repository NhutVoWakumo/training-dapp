"use client";

import { AllNFTList, OwnedNFTList } from "./NFTList";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { GiGoldBar, GiGoldMine } from "react-icons/gi";
import { IChainData, OpenseaCollection } from "@/app/interfaces";

import React from "react";
import { useWalletProvider } from "@/app/hooks";

interface CollectionContentProps {
  address: string;
  slug: string;
  collectionData: OpenseaCollection;
  chainData?: IChainData;
}

export const CollectionContent = ({
  address,
  slug,
  collectionData,
  chainData,
}: CollectionContentProps) => {
  const { selectedAccount } = useWalletProvider();
  return (
    <div className="p-3 md:p-10">
      <Tabs
        aria-label="Option NFTs"
        color="secondary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor:
            "w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-purple-400",
        }}
      >
        <Tab
          key={"all-nfts"}
          title={
            <div className="flex items-center space-x-2">
              <p>
                <GiGoldMine size={24} />
              </p>
              <span>All NFTs</span>
            </div>
          }
        >
          <Card>
            <CardBody>
              <AllNFTList
                collectionAddress={address}
                slug={slug}
                chainData={chainData}
                nftImageFallback={collectionData.image_url}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key={"owned-nfts"}
          title={
            <div className="flex items-center space-x-2">
              <GiGoldBar size={24} />
              <span>My NFTs</span>
            </div>
          }
        >
          <Card>
            <CardBody>
              <OwnedNFTList
                accountAddress={selectedAccount as string}
                slug={slug}
                chainData={chainData}
                nftImageFallback={collectionData.image_url}
              />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

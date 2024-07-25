import { Avatar, Image, Snippet } from "@nextui-org/react";

import Jazzicon from "react-jazzicon/dist/Jazzicon";
import Markdown from "react-markdown";
import { OpenseaCollection } from "@/app/interfaces";
import React from "react";
import { formatAddress } from "@/app/utils";
import { jsNumberForAddress } from "react-jazzicon";

interface CollectionHeaderProps {
  address: string;
  collectionData: OpenseaCollection;
  isLoading?: boolean;
}

export const CollectionHeader = ({
  address,
  collectionData,
  isLoading = false,
}: CollectionHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 overflow-x-hidden">
      <div className="h-[250px]">
        {!isLoading && (
          <div className="relative">
            {collectionData?.banner_image_url ? (
              <Image
                src={collectionData?.banner_image_url}
                className="h-[250px] w-[100vw] rounded-none object-cover blur-lg"
                alt="banner"
                isBlurred
              />
            ) : (
              <div className="h-[250px] w-full bg-gradient-to-t from-black via-gray-900 to-gray-700 blur-lg" />
            )}
            <div className="absolute bottom-0 z-20 h-10 w-full">
              <div className="relative size-full">
                <div className="absolute -top-16 left-10 flex flex-col gap-3">
                  <Avatar
                    src={collectionData?.image_url}
                    showFallback
                    fallback={
                      <Jazzicon
                        diameter={70}
                        seed={jsNumberForAddress(address)}
                      />
                    }
                    className="sm:size-14 md:size-16 lg:size-20"
                    radius="md"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-semibold">
                      {collectionData?.name}
                    </p>
                    <Snippet
                      codeString={address}
                      size="md"
                      className="bg-transparent px-0"
                      symbol=""
                    >
                      {formatAddress(address)}
                    </Snippet>
                  </div>
                </div>

                <div className="absolute -top-3 right-10 flex flex-col gap-1">
                  <p className="text-gray text-xl font-bold">
                    {collectionData?.total_supply}
                  </p>
                  <p className="font-light text-gray-300">Total NFTs</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-5 flex w-full flex-col items-start justify-between gap-3 p-10 md:flex-row-reverse">
        {!!collectionData?.owner && (
          <div className="flex items-center gap-3">
            <p>Owner:</p>
            <div className="flex items-center gap-1">
              <Avatar
                icon={
                  <Jazzicon
                    diameter={30}
                    seed={jsNumberForAddress(collectionData.owner)}
                  />
                }
                className="size-6 text-tiny"
              />
              <Snippet
                codeString={collectionData.owner}
                symbol=""
                size="sm"
                className="bg-transparent p-0 text-gray-700"
              >
                {formatAddress(collectionData.owner)}
              </Snippet>
            </div>
          </div>
        )}
        {collectionData?.description && (
          <div>
            <Markdown className={"text-sm"}>
              {collectionData.description}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

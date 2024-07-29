import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Image,
  Spinner,
} from "@nextui-org/react";

import { GiCardPick } from "react-icons/gi";
import Link from "next/link";
import { OpenseaNFTWithoutTrait } from "@/app/interfaces";
import React from "react";

interface NFTListProps {
  dataList: OpenseaNFTWithoutTrait[];
  isLoading: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
  nftImageFallback?: string;
}

export const NFTList = ({
  canLoadMore,
  dataList,
  isLoading,
  onLoadMore,
  nftImageFallback,
}: NFTListProps) => {
  if (!dataList.length)
    return (
      <div className="flex h-40 w-full flex-col items-center justify-center gap-4">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <GiCardPick size={70} />
            <p>Nothing here, let&apos;s collect them all!</p>
          </div>
        )}
      </div>
    );
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {dataList.map((nft, index) => (
          <Link
            key={index}
            href={`${window.location.pathname}/${nft.identifier}`}
          >
            <Card
              isHoverable
              isPressable
              isFooterBlurred
              radius="md"
              className="min-h-40 border-none"
            >
              {nft?.display_image_url ? (
                <Image
                  src={nft.display_image_url}
                  alt={nft.identifier}
                  className="aspect-square w-full object-cover"
                  removeWrapper
                  isZoomed
                />
              ) : (
                <>
                  <CardHeader className="absolute top-1 z-20 flex h-full flex-col items-center justify-center">
                    <p className="m-auto text-tiny font-bold uppercase text-white/60">
                      Content not available yet
                    </p>
                  </CardHeader>

                  <Image
                    src={nftImageFallback}
                    alt={nft.identifier}
                    className="aspect-square w-full object-cover blur-lg"
                    removeWrapper
                  />
                </>
              )}

              <CardFooter className="absolute bottom-0 z-10 flex items-center justify-between gap-2 border-t-1 border-default-600 bg-black/40 dark:border-default-100">
                <p className="truncate text-sm text-white/80">{nft?.name}</p>
                <p className="text-sm text-white/80">#{nft.identifier}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      {canLoadMore ? (
        <div className="my-5 flex justify-center">
          <Button isLoading={isLoading} onClick={onLoadMore}>
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
};

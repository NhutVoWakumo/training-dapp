import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";

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

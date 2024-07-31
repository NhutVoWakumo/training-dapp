import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Tooltip,
} from "@nextui-org/react";

import { BiLinkExternal } from "react-icons/bi";
import { ChainLogo } from "@api3/logos";
import { IChainData } from "@/app/interfaces";
import React from "react";

interface NFTImageProps {
  imgSrc: string;
  fallbackSrc: string;
  isLoading?: boolean;
  chainData: IChainData;
}

export const NFTImage = ({
  chainData,
  imgSrc,
  isLoading = false,
  fallbackSrc,
}: NFTImageProps) => {
  return (
    <Card
      className="flex size-full flex-col lg:min-w-[40vw]"
      classNames={{ base: "border border-transparent" }}
    >
      <CardHeader className="flex w-full items-center justify-between px-5 py-0">
        <Tooltip content={chainData?.name}>
          <Avatar
            radius="full"
            src={(ChainLogo(chainData?.chainId?.toString()) as any).src}
            className="size-6 bg-transparent text-tiny"
          />
        </Tooltip>
        {!!imgSrc && (
          <Button
            variant="flat"
            className="bg-transparent"
            onClick={() => window.open(imgSrc, "_blank")}
            isIconOnly
          >
            <BiLinkExternal size={16} color="#8fc7ff" />
          </Button>
        )}
      </CardHeader>
      {imgSrc ? (
        <Image
          isLoading={isLoading}
          src={imgSrc}
          alt={"nft image"}
          className="aspect-square w-[100vw] rounded-none bg-black object-contain pb-3 lg:w-[40vw]"
        />
      ) : (
        <>
          <CardHeader className="absolute top-10 z-20 flex h-full flex-col items-center justify-center">
            <p className="m-auto text-tiny font-bold uppercase text-white/60">
              Content not available yet
            </p>
          </CardHeader>

          <Image
            src={fallbackSrc}
            alt={"nft fallback image"}
            className="aspect-square w-[100vw] object-cover pb-3 blur-lg lg:w-[40vw]"
          />
        </>
      )}
    </Card>
  );
};

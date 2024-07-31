import {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Button,
  Link,
  Tooltip,
  User,
} from "@nextui-org/react";
import { BiLinkExternal, BiListUl, BiPlanet, BiPyramid } from "react-icons/bi";
import { IChainData, OpenseaCollection, OpenseaNFT } from "@/app/interfaces";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  calculateDateFromNow,
  formatAddress,
  formatReadableDate,
  parseIPFSToNormalUrl,
} from "@/app/utils";

import Markdown from "react-markdown";
import { getOpenseaNFTsByContract } from "../../utils";

interface NFTDataProps {
  nftData: OpenseaNFT["nft"];
  isLoading?: boolean;
  collectionData: OpenseaCollection;
  collectionAddress: string;
  chainData: IChainData;
}

interface NFTDetailItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}

interface NFTImagePreview {
  url: string;
  tokenId: string;
}

const NUMBER_OF_NFT_PREVIEW_IMAGE = 5;

export const NFTData = ({
  nftData,
  isLoading,
  collectionData,
  collectionAddress,
  chainData,
}: NFTDataProps) => {
  const [previewNFTImages, setPreviewNFTImages] = useState<NFTImagePreview[]>(
    [],
  );

  const nftDetails: NFTDetailItem[] = useMemo(() => {
    return [
      {
        key: "contractAddress",
        label: "Contract Address",
        children: (
          <Link
            isExternal
            href={`${chainData?.explorers?.[0]?.url}/address/${collectionAddress}`}
          >
            {formatAddress(collectionAddress)}
          </Link>
        ),
      },
      {
        key: "tokenId",
        label: "Token ID",
        children: (
          <Link
            isDisabled={!nftData.metadata_url}
            isExternal
            href={parseIPFSToNormalUrl(nftData.metadata_url)}
          >
            {nftData.identifier}
          </Link>
        ),
      },
      {
        key: "tokenStandard",
        label: "Token Standard",
        children: nftData.token_standard.toUpperCase(),
      },
      {
        key: "chain",
        label: "Chain",
        children: chainData.name,
      },
      {
        key: "lastUpdated",
        label: "Last Updated",
        children: (
          <Tooltip
            content={formatReadableDate(
              nftData.updated_at,
              "DD/MM/YYYY[, at] HH:mm:ss",
            )}
          >
            {calculateDateFromNow(nftData.updated_at)}
          </Tooltip>
        ),
      },
    ];
  }, [chainData, collectionAddress, nftData]);

  const previewNFT = useCallback(async () => {
    if (!chainData) return [];
    try {
      const { data } = await getOpenseaNFTsByContract(
        collectionAddress,
        chainData,
      );
      const nftImageUrls = data.nfts
        .filter((nft) => !!nft.display_image_url)
        .map((nft) => ({
          url: nft.display_image_url,
          tokenId: nft.identifier.toString(),
        }));

      setPreviewNFTImages(nftImageUrls.slice(0, NUMBER_OF_NFT_PREVIEW_IMAGE));
    } catch (error) {
      console.error(error);
    }
  }, [chainData, collectionAddress]);

  useEffect(() => {
    previewNFT();
  }, [previewNFT]);

  return (
    <div className="flex w-full flex-col gap-5 p-3">
      <div className="flex w-full items-center justify-between">
        <Tooltip
          delay={500}
          content={
            <div className="flex flex-col items-start justify-start gap-5 p-3">
              <User
                name={
                  <p className="text-lg font-medium">{collectionData.name}</p>
                }
                description={formatAddress(collectionAddress)}
                avatarProps={{
                  src: collectionData.image_url,
                  radius: "md",
                  size: "lg",
                }}
              />

              <AvatarGroup
                isBordered
                max={NUMBER_OF_NFT_PREVIEW_IMAGE}
                total={
                  collectionData.total_supply > previewNFTImages.length
                    ? collectionData.total_supply - previewNFTImages.length
                    : 0
                }
                className="ml-2"
              >
                {previewNFTImages.map((img, index) => (
                  <Link
                    key={index}
                    isExternal
                    href={`/nft-collections/${collectionAddress}/${img.tokenId}`}
                  >
                    <Avatar src={img.url} alt="nft preview" />
                  </Link>
                ))}
              </AvatarGroup>
            </div>
          }
        >
          <Link
            isExternal
            href={`/nft-collections/${collectionAddress}`}
            className="max-w-[80%] truncate text-lg text-light-sky"
          >
            {collectionData.name}
          </Link>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-2">
        <p className="w-full break-words text-2xl font-bold lg:text-3xl">
          {nftData.name ?? `${collectionData.name} #${nftData.identifier}`}
        </p>
        <p className="">{`Owned by ${formatAddress(nftData.owners?.[0]?.address)}`}</p>
      </div>
      <Accordion
        variant="light"
        selectionMode="multiple"
        defaultExpandedKeys={"all"}
        isDisabled={isLoading}
      >
        <AccordionItem
          key="description"
          title={<div className="font-semibold">Description</div>}
          aria-label="NFT description"
          startContent={<BiPyramid size={22} />}
        >
          <div className="flex flex-col gap-2">
            {nftData?.creator && (
              <p className="text-sm text-gray-500">{`Created by ${formatAddress(nftData.creator)}`}</p>
            )}
            {nftData?.description && <Markdown>{nftData.description}</Markdown>}
          </div>
        </AccordionItem>
        <AccordionItem
          key="about"
          title={
            <div className="font-semibold">{`About ${collectionData.name}`}</div>
          }
          aria-label={`About ${collectionData.name}`}
          startContent={<BiPlanet size={22} />}
        >
          <div className="mb-5 flex gap-3">
            <Avatar
              src={collectionData.image_url}
              radius="sm"
              className="size-20"
            />
            <Markdown>{collectionData.description}</Markdown>
          </div>
          <Button
            variant="bordered"
            onClick={() =>
              window.open(
                `${chainData?.explorers?.[0]?.url}/address/${collectionAddress}`,
                "_blank",
              )
            }
          >
            Explorer <BiLinkExternal size={22} />
          </Button>
        </AccordionItem>
        <AccordionItem
          key="details"
          title={<div className="font-semibold">Details</div>}
          aria-label="Details"
          startContent={<BiListUl size={22} />}
        >
          <div className="flex flex-col gap-3">
            {nftDetails?.map((item) => (
              <div
                key={item.key}
                className="flex w-full items-center justify-between"
              >
                <p>{item.label}</p>
                <div className="font-light">{item.children}</div>
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

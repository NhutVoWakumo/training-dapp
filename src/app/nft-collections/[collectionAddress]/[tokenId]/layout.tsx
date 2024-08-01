import { Metadata } from "next";
import { NFTDetailProps } from "./page";
import React from "react";
import { formatAddress } from "@/app/utils";

export function generateMetadata({ params }: NFTDetailProps): Metadata {
  return {
    title: {
      absolute: `#${params.tokenId} | Collection ${formatAddress(params.collectionAddress)}`,
    },
  };
}

const NFTDetailLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default NFTDetailLayout;

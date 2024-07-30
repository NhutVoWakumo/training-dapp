import { CollectionDetailProps } from "./page";
import { Metadata } from "next";
import React from "react";
import { formatAddress } from "@/app/utils";

export function generateMetadata({ params }: CollectionDetailProps): Metadata {
  return {
    title: `Collection ${formatAddress(params.collectionAddress)}`,
  };
}

const CollectionDetailLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default CollectionDetailLayout;

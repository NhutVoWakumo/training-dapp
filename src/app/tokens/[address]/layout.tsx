import { Metadata } from "next";
import React from "react";
import { TokenDetailProps } from "./page";
import { formatAddress } from "@/app/utils";

export function generateMetadata({ params }: TokenDetailProps): Metadata {
  return {
    title: `Collection ${formatAddress(params.address)}`,
  };
}

const TokenDetailLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="px-3 py-5 md:px-10">{children}</div>;
};

export default TokenDetailLayout;

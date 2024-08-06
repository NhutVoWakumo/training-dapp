"use client";

import { Avatar, Snippet } from "@nextui-org/react";

import { AnimatedGradientText } from "@/app/components";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import React from "react";
import { formatAddress } from "@/app/utils";
import { getTokenLogo } from "../../utils";
import { jsNumberForAddress } from "react-jazzicon";
import { useGetTokenMetadata } from "../../hooks";

interface TokenDetailHeaderProps {
  tokenAddress: string;
}

export const TokenDetailHeader = ({ tokenAddress }: TokenDetailHeaderProps) => {
  const { tokenMetadata } = useGetTokenMetadata(tokenAddress);
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={getTokenLogo(
          tokenMetadata?.symbol as string,
          tokenMetadata?.logoUrl,
        )}
        showFallback
        fallback={
          <Jazzicon diameter={50} seed={jsNumberForAddress(tokenAddress)} />
        }
        className="h-10 w-10"
      />
      <AnimatedGradientText>{tokenMetadata?.name}</AnimatedGradientText>
      <Snippet
        className="bg-transparent p-0"
        codeString={tokenAddress}
        symbol=""
      >
        {formatAddress(tokenAddress)}
      </Snippet>
    </div>
  );
};

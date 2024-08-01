import { AnimatedGradientText } from "@/app/components";
import React from "react";
import { TokenDetailHeader } from "./components";

export interface TokenDetailProps {
  params: TokenDetailParams;
}

interface TokenDetailParams {
  address: string;
}

const TokenDetail = ({ params }: TokenDetailProps) => {
  const { address } = params;
  return (
    <div className="flex flex-col gap-5">
      <TokenDetailHeader tokenAddress={address} />
    </div>
  );
};

export default TokenDetail;

import { TokenDetailHeader, TokenTransactionTable } from "./components";

import React from "react";

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
      <TokenTransactionTable tokenAddress={address} />
    </div>
  );
};

export default TokenDetail;

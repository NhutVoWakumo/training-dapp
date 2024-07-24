import { ITokenData } from "../../interfaces";
import React from "react";

interface TokenBalanceCellProps {
  token: ITokenData;
}

export const TokenBalanceCell = ({ token }: TokenBalanceCellProps) => {
  return (
    <div>
      <div className="hidden font-medium md:block">{`${token.balance} ${token.symbol}`}</div>
      <div className="font-light md:hidden">{token.balance}</div>
    </div>
  );
};
